
import { StorageInterface } from './StorageInterface';
import { User, Password, PasswordCategory, PermissionGroup, LogEntry } from '../../models/types';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseConfig } from './StorageFactory';
import { toast } from "@/components/ui/use-toast";

/**
 * MySQL Storage Service
 * 
 * This service implements the StorageInterface for MySQL.
 * In browser environments, it simulates MySQL using localStorage with table prefixes.
 */
export class MySQLStorageService implements StorageInterface {
  private dbConfig: DatabaseConfig;
  private simulation: boolean = true;
  private prefix: string = 'mysql_';
  private tables: Record<string, string> = {
    users: this.prefix + 'users',
    passwords: this.prefix + 'passwords',
    categories: this.prefix + 'categories',
    groups: this.prefix + 'groups',
    logs: this.prefix + 'logs',
  };

  constructor(config: DatabaseConfig) {
    this.dbConfig = config;
    this.initializeSimulation();
    this.checkServerConnection();
  }
  
  // Check if we can connect to the real MySQL server
  private async checkServerConnection(): Promise<boolean> {
    if (typeof window === 'undefined') {
      // Node.js environment - assume real connection
      return true;
    }
    
    try {
      const response = await fetch(`${this.dbConfig.apiUrl}/status`);
      if (response.ok) {
        const data = await response.json();
        this.simulation = data.status !== 'connected';
        return !this.simulation;
      }
      return false;
    } catch (error) {
      console.error("Cannot connect to MySQL server:", error);
      this.simulation = true;
      return false;
    }
  }
  
  // Initialize simulation tables if they don't exist
  private initializeSimulation(): void {
    if (typeof window === 'undefined') return;
    
    // Create tables if they don't exist
    Object.values(this.tables).forEach(table => {
      if (!localStorage.getItem(table)) {
        localStorage.setItem(table, JSON.stringify([]));
      }
    });
  }
  
  // Fetch data from a simulated table
  private getTable<T>(tableName: string): T[] {
    const data = localStorage.getItem(tableName);
    return data ? JSON.parse(data) : [];
  }
  
  // Save data to a simulated table
  private saveTable<T>(tableName: string, data: T[]): void {
    localStorage.setItem(tableName, JSON.stringify(data));
  }
  
  // Make API request to the server
  private async apiRequest<T>(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any
  ): Promise<T> {
    if (this.simulation) {
      throw new Error('Cannot make API request in simulation mode');
    }
    
    try {
      const response = await fetch(`${this.dbConfig.apiUrl}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request error (${method} ${endpoint}):`, error);
      
      // If API request fails, switch to simulation mode
      this.simulation = true;
      toast({
        title: "Erro na Conexão",
        description: "Falha na comunicação com o servidor. Usando modo de simulação.",
        variant: "destructive"
      });
      
      throw error;
    }
  }

  // User management
  
  async getUsers(): Promise<User[]> {
    if (this.simulation) {
      return this.getTable<User>(this.tables.users);
    }
    
    try {
      return await this.apiRequest<User[]>('/users');
    } catch (error) {
      // Fallback to simulation
      return this.getTable<User>(this.tables.users);
    }
  }
  
  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    const newUser: User = {
      id: uuidv4(),
      ...userData,
      created: new Date().toISOString(),
      lastLogin: null
    };
    
    if (this.simulation) {
      const users = this.getTable<User>(this.tables.users);
      users.push(newUser);
      this.saveTable(this.tables.users, users);
      return newUser;
    }
    
    try {
      return await this.apiRequest<User>('/users', 'POST', userData);
    } catch (error) {
      // Fallback to simulation
      const users = this.getTable<User>(this.tables.users);
      users.push(newUser);
      this.saveTable(this.tables.users, users);
      return newUser;
    }
  }
  
  async getUserById(id: string): Promise<User | null> {
    if (this.simulation) {
      const users = this.getTable<User>(this.tables.users);
      return users.find(user => user.id === id) || null;
    }
    
    try {
      return await this.apiRequest<User>(`/users/${id}`);
    } catch (error) {
      // Fallback to simulation
      const users = this.getTable<User>(this.tables.users);
      return users.find(user => user.id === id) || null;
    }
  }
  
  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    if (this.simulation) {
      const users = this.getTable<User>(this.tables.users);
      const index = users.findIndex(user => user.id === id);
      
      if (index === -1) {
        throw new Error(`User with ID ${id} not found`);
      }
      
      const updatedUser = { ...users[index], ...userData };
      users[index] = updatedUser;
      this.saveTable(this.tables.users, users);
      return updatedUser;
    }
    
    try {
      return await this.apiRequest<User>(`/users/${id}`, 'PUT', userData);
    } catch (error) {
      // Fallback to simulation
      const users = this.getTable<User>(this.tables.users);
      const index = users.findIndex(user => user.id === id);
      
      if (index === -1) {
        throw new Error(`User with ID ${id} not found`);
      }
      
      const updatedUser = { ...users[index], ...userData };
      users[index] = updatedUser;
      this.saveTable(this.tables.users, users);
      return updatedUser;
    }
  }
  
  async deleteUser(id: string): Promise<boolean> {
    if (this.simulation) {
      const users = this.getTable<User>(this.tables.users);
      const filteredUsers = users.filter(user => user.id !== id);
      
      if (filteredUsers.length === users.length) {
        return false;
      }
      
      this.saveTable(this.tables.users, filteredUsers);
      return true;
    }
    
    try {
      await this.apiRequest<void>(`/users/${id}`, 'DELETE');
      return true;
    } catch (error) {
      // Fallback to simulation
      const users = this.getTable<User>(this.tables.users);
      const filteredUsers = users.filter(user => user.id !== id);
      
      if (filteredUsers.length === users.length) {
        return false;
      }
      
      this.saveTable(this.tables.users, filteredUsers);
      return true;
    }
  }
  
  // Password management
  
  async getPasswords(): Promise<Password[]> {
    if (this.simulation) {
      return this.getTable<Password>(this.tables.passwords);
    }
    
    try {
      return await this.apiRequest<Password[]>('/passwords');
    } catch (error) {
      // Fallback to simulation
      return this.getTable<Password>(this.tables.passwords);
    }
  }
  
  async createPassword(passwordData: Omit<Password, 'id'>): Promise<Password> {
    const newPassword: Password = {
      id: uuidv4(),
      ...passwordData,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    };
    
    if (this.simulation) {
      const passwords = this.getTable<Password>(this.tables.passwords);
      passwords.push(newPassword);
      this.saveTable(this.tables.passwords, passwords);
      return newPassword;
    }
    
    try {
      // Map category to category_id as expected by server
      const serverPasswordData = {
        ...passwordData,
        category_id: passwordData.category,
      };
      
      return await this.apiRequest<Password>('/passwords', 'POST', serverPasswordData);
    } catch (error) {
      // Fallback to simulation
      const passwords = this.getTable<Password>(this.tables.passwords);
      passwords.push(newPassword);
      this.saveTable(this.tables.passwords, passwords);
      return newPassword;
    }
  }
  
  async getPasswordById(id: string): Promise<Password | null> {
    if (this.simulation) {
      const passwords = this.getTable<Password>(this.tables.passwords);
      return passwords.find(password => password.id === id) || null;
    }
    
    try {
      return await this.apiRequest<Password>(`/passwords/${id}`);
    } catch (error) {
      // Fallback to simulation
      const passwords = this.getTable<Password>(this.tables.passwords);
      return passwords.find(password => password.id === id) || null;
    }
  }
  
  async updatePassword(id: string, passwordData: Partial<Password>): Promise<Password> {
    if (this.simulation) {
      const passwords = this.getTable<Password>(this.tables.passwords);
      const index = passwords.findIndex(password => password.id === id);
      
      if (index === -1) {
        throw new Error(`Password with ID ${id} not found`);
      }
      
      const updatedPassword = { 
        ...passwords[index], 
        ...passwordData,
        updated: new Date().toISOString()
      };
      
      passwords[index] = updatedPassword;
      this.saveTable(this.tables.passwords, passwords);
      return updatedPassword;
    }
    
    try {
      // Map category to category_id as expected by server
      const serverPasswordData = {
        ...passwordData,
        category_id: passwordData.category,
        updated: new Date().toISOString()
      };
      
      return await this.apiRequest<Password>(`/passwords/${id}`, 'PUT', serverPasswordData);
    } catch (error) {
      // Fallback to simulation
      const passwords = this.getTable<Password>(this.tables.passwords);
      const index = passwords.findIndex(password => password.id === id);
      
      if (index === -1) {
        throw new Error(`Password with ID ${id} not found`);
      }
      
      const updatedPassword = { 
        ...passwords[index], 
        ...passwordData,
        updated: new Date().toISOString()
      };
      
      passwords[index] = updatedPassword;
      this.saveTable(this.tables.passwords, passwords);
      return updatedPassword;
    }
  }
  
  async deletePassword(id: string): Promise<boolean> {
    if (this.simulation) {
      const passwords = this.getTable<Password>(this.tables.passwords);
      const filteredPasswords = passwords.filter(password => password.id !== id);
      
      if (filteredPasswords.length === passwords.length) {
        return false;
      }
      
      this.saveTable(this.tables.passwords, filteredPasswords);
      return true;
    }
    
    try {
      await this.apiRequest<void>(`/passwords/${id}`, 'DELETE');
      return true;
    } catch (error) {
      // Fallback to simulation
      const passwords = this.getTable<Password>(this.tables.passwords);
      const filteredPasswords = passwords.filter(password => password.id !== id);
      
      if (filteredPasswords.length === passwords.length) {
        return false;
      }
      
      this.saveTable(this.tables.passwords, filteredPasswords);
      return true;
    }
  }
  
  // Category management
  
  async getCategories(): Promise<PasswordCategory[]> {
    if (this.simulation) {
      return this.getTable<PasswordCategory>(this.tables.categories);
    }
    
    try {
      return await this.apiRequest<PasswordCategory[]>('/categories');
    } catch (error) {
      // Fallback to simulation
      return this.getTable<PasswordCategory>(this.tables.categories);
    }
  }
  
  async createCategory(categoryData: Omit<PasswordCategory, 'id'>): Promise<PasswordCategory> {
    const newCategory: PasswordCategory = {
      id: uuidv4(),
      ...categoryData
    };
    
    if (this.simulation) {
      const categories = this.getTable<PasswordCategory>(this.tables.categories);
      categories.push(newCategory);
      this.saveTable(this.tables.categories, categories);
      return newCategory;
    }
    
    try {
      return await this.apiRequest<PasswordCategory>('/categories', 'POST', categoryData);
    } catch (error) {
      // Fallback to simulation
      const categories = this.getTable<PasswordCategory>(this.tables.categories);
      categories.push(newCategory);
      this.saveTable(this.tables.categories, categories);
      return newCategory;
    }
  }
  
  async updateCategory(id: string, categoryData: Partial<PasswordCategory>): Promise<PasswordCategory> {
    if (this.simulation) {
      const categories = this.getTable<PasswordCategory>(this.tables.categories);
      const index = categories.findIndex(category => category.id === id);
      
      if (index === -1) {
        throw new Error(`Category with ID ${id} not found`);
      }
      
      const updatedCategory = { ...categories[index], ...categoryData };
      categories[index] = updatedCategory;
      this.saveTable(this.tables.categories, categories);
      return updatedCategory;
    }
    
    try {
      return await this.apiRequest<PasswordCategory>(`/categories/${id}`, 'PUT', categoryData);
    } catch (error) {
      // Fallback to simulation
      const categories = this.getTable<PasswordCategory>(this.tables.categories);
      const index = categories.findIndex(category => category.id === id);
      
      if (index === -1) {
        throw new Error(`Category with ID ${id} not found`);
      }
      
      const updatedCategory = { ...categories[index], ...categoryData };
      categories[index] = updatedCategory;
      this.saveTable(this.tables.categories, categories);
      return updatedCategory;
    }
  }
  
  async deleteCategory(id: string): Promise<boolean> {
    if (this.simulation) {
      const categories = this.getTable<PasswordCategory>(this.tables.categories);
      const filteredCategories = categories.filter(category => category.id !== id);
      
      if (filteredCategories.length === categories.length) {
        return false;
      }
      
      this.saveTable(this.tables.categories, filteredCategories);
      return true;
    }
    
    try {
      await this.apiRequest<void>(`/categories/${id}`, 'DELETE');
      return true;
    } catch (error) {
      // Fallback to simulation
      const categories = this.getTable<PasswordCategory>(this.tables.categories);
      const filteredCategories = categories.filter(category => category.id !== id);
      
      if (filteredCategories.length === categories.length) {
        return false;
      }
      
      this.saveTable(this.tables.categories, filteredCategories);
      return true;
    }
  }
  
  // Group management
  
  async getGroups(): Promise<PermissionGroup[]> {
    if (this.simulation) {
      return this.getTable<PermissionGroup>(this.tables.groups);
    }
    
    try {
      return await this.apiRequest<PermissionGroup[]>('/groups');
    } catch (error) {
      // Fallback to simulation
      return this.getTable<PermissionGroup>(this.tables.groups);
    }
  }
  
  async createGroup(groupData: Omit<PermissionGroup, 'id'>): Promise<PermissionGroup> {
    const newGroup: PermissionGroup = {
      id: uuidv4(),
      ...groupData
    };
    
    if (this.simulation) {
      const groups = this.getTable<PermissionGroup>(this.tables.groups);
      groups.push(newGroup);
      this.saveTable(this.tables.groups, groups);
      return newGroup;
    }
    
    try {
      return await this.apiRequest<PermissionGroup>('/groups', 'POST', groupData);
    } catch (error) {
      // Fallback to simulation
      const groups = this.getTable<PermissionGroup>(this.tables.groups);
      groups.push(newGroup);
      this.saveTable(this.tables.groups, groups);
      return newGroup;
    }
  }
  
  async updateGroup(id: string, groupData: Partial<PermissionGroup>): Promise<PermissionGroup> {
    if (this.simulation) {
      const groups = this.getTable<PermissionGroup>(this.tables.groups);
      const index = groups.findIndex(group => group.id === id);
      
      if (index === -1) {
        throw new Error(`Group with ID ${id} not found`);
      }
      
      const updatedGroup = { ...groups[index], ...groupData };
      groups[index] = updatedGroup;
      this.saveTable(this.tables.groups, groups);
      return updatedGroup;
    }
    
    try {
      return await this.apiRequest<PermissionGroup>(`/groups/${id}`, 'PUT', groupData);
    } catch (error) {
      // Fallback to simulation
      const groups = this.getTable<PermissionGroup>(this.tables.groups);
      const index = groups.findIndex(group => group.id === id);
      
      if (index === -1) {
        throw new Error(`Group with ID ${id} not found`);
      }
      
      const updatedGroup = { ...groups[index], ...groupData };
      groups[index] = updatedGroup;
      this.saveTable(this.tables.groups, groups);
      return updatedGroup;
    }
  }
  
  async deleteGroup(id: string): Promise<boolean> {
    if (this.simulation) {
      const groups = this.getTable<PermissionGroup>(this.tables.groups);
      const filteredGroups = groups.filter(group => group.id !== id);
      
      if (filteredGroups.length === groups.length) {
        return false;
      }
      
      this.saveTable(this.tables.groups, filteredGroups);
      return true;
    }
    
    try {
      await this.apiRequest<void>(`/groups/${id}`, 'DELETE');
      return true;
    } catch (error) {
      // Fallback to simulation
      const groups = this.getTable<PermissionGroup>(this.tables.groups);
      const filteredGroups = groups.filter(group => group.id !== id);
      
      if (filteredGroups.length === groups.length) {
        return false;
      }
      
      this.saveTable(this.tables.groups, filteredGroups);
      return true;
    }
  }
  
  // Log management
  
  async getLogs(): Promise<LogEntry[]> {
    if (this.simulation) {
      return this.getTable<LogEntry>(this.tables.logs);
    }
    
    try {
      return await this.apiRequest<LogEntry[]>('/logs');
    } catch (error) {
      // Fallback to simulation
      return this.getTable<LogEntry>(this.tables.logs);
    }
  }
  
  async createLog(logData: Omit<LogEntry, 'id'>): Promise<LogEntry> {
    const newLog: LogEntry = {
      id: uuidv4(),
      ...logData,
      timestamp: new Date().toISOString()
    };
    
    if (this.simulation) {
      const logs = this.getTable<LogEntry>(this.tables.logs);
      logs.push(newLog);
      this.saveTable(this.tables.logs, logs);
      return newLog;
    }
    
    try {
      return await this.apiRequest<LogEntry>('/logs', 'POST', logData);
    } catch (error) {
      // Fallback to simulation
      const logs = this.getTable<LogEntry>(this.tables.logs);
      logs.push(newLog);
      this.saveTable(this.tables.logs, logs);
      return newLog;
    }
  }
  
  // Authentication
  
  async login(username: string, password: string): Promise<User> {
    // In simulation mode, find user in localStorage
    if (this.simulation) {
      const users = this.getTable<User>(this.tables.users);
      const user = users.find(u => 
        u.username === username && u.password === password
      );
      
      if (!user) {
        throw new Error('Invalid username or password');
      }
      
      // Update last login timestamp
      const updatedUser = {
        ...user,
        lastLogin: new Date().toISOString()
      };
      
      await this.updateUser(user.id, { lastLogin: updatedUser.lastLogin });
      
      // Store currentUser
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Create log entry
      await this.createLog({
        userId: user.id,
        action: 'login',
        details: `User ${username} logged in`,
        timestamp: new Date().toISOString()
      });
      
      return updatedUser;
    }
    
    try {
      const user = await this.apiRequest<User>('/auth/login', 'POST', { username, password });
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    } catch (error) {
      // Fallback to simulation
      const users = this.getTable<User>(this.tables.users);
      const user = users.find(u => 
        u.username === username && u.password === password
      );
      
      if (!user) {
        throw new Error('Invalid username or password');
      }
      
      // Update last login timestamp
      const updatedUser = {
        ...user,
        lastLogin: new Date().toISOString()
      };
      
      await this.updateUser(user.id, { lastLogin: updatedUser.lastLogin });
      
      // Store currentUser
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Create log entry
      await this.createLog({
        userId: user.id,
        action: 'login',
        details: `User ${username} logged in`,
        timestamp: new Date().toISOString()
      });
      
      return updatedUser;
    }
  }
  
  async logout(): Promise<void> {
    const currentUser = this.getCurrentUser();
    
    if (currentUser) {
      // Create log entry
      await this.createLog({
        userId: currentUser.id,
        action: 'logout',
        details: `User ${currentUser.username} logged out`,
        timestamp: new Date().toISOString()
      });
    }
    
    localStorage.removeItem('currentUser');
    
    // Dispatch event to notify the app about authentication change
    const event = new Event('auth-change');
    window.dispatchEvent(event);
    
    if (!this.simulation) {
      try {
        await this.apiRequest<void>('/auth/logout', 'POST');
      } catch (error) {
        // Just log the error, the user is already logged out locally
        console.error('Error during API logout:', error);
      }
    }
  }
  
  getCurrentUser(): User | null {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  }
}
