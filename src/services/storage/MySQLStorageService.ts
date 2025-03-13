import { StorageInterface } from './StorageInterface';
import { User, Password, PasswordCategory, PermissionGroup, LogEntry } from '../../models/types';
import { toast } from "@/components/ui/use-toast";
import { DatabaseConfig } from './StorageFactory';

// This is a simulated MySQL implementation that uses localStorage as a backend
// but maintains a separate namespace for MySQL data
export class MySQLStorageService implements StorageInterface {
  private readonly dbConfig: DatabaseConfig;
  private readonly PREFIX: string;
  
  constructor(dbConfig: DatabaseConfig) {
    this.dbConfig = dbConfig;
    this.PREFIX = `mysql_${this.dbConfig.name}_`;
    
    console.log('MySQL Storage Service initialized with database:', this.dbConfig.name);
    this.initializeDatabase();
  }
  
  // Initialize database with default values if empty
  private initializeDatabase() {
    // Check if database is already initialized
    if (!localStorage.getItem(`${this.PREFIX}initialized`)) {
      console.log(`Initializing MySQL database simulation for ${this.dbConfig.name}...`);
      
      // Set initialized flag
      localStorage.setItem(`${this.PREFIX}initialized`, 'true');
      
      // Show toast notification
      toast({
        title: "Banco de Dados Inicializado",
        description: `Conexão com MySQL (${this.dbConfig.name}) simulada estabelecida com sucesso.`,
      });
    }
  }

  // Helper methods
  private generateId(): string {
    return Date.now().toString();
  }
  
  private getItem<T>(key: string): T[] {
    const data = localStorage.getItem(`${this.PREFIX}${key}`);
    return data ? JSON.parse(data) : [];
  }
  
  private setItem<T>(key: string, data: T[]): void {
    localStorage.setItem(`${this.PREFIX}${key}`, JSON.stringify(data));
  }

  // User operations
  async getUsers(): Promise<User[]> {
    return this.getItem<User>('users');
  }

  async getUserById(id: string): Promise<User | null> {
    const users = await this.getUsers();
    return users.find(user => user.id === id) || null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const users = await this.getUsers();
    return users.find(user => user.username === username) || null;
  }

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    const users = await this.getUsers();
    const newUser = { ...user, id: this.generateId(), active: user.active !== false };
    this.setItem('users', [...users, newUser]);
    return newUser;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const users = await this.getUsers();
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      throw new Error(`User with id ${id} not found in MySQL database`);
    }
    
    const updatedUser = { ...users[userIndex], ...userData };
    users[userIndex] = updatedUser;
    this.setItem('users', users);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    const users = await this.getUsers();
    const filteredUsers = users.filter(user => user.id !== id);
    
    if (filteredUsers.length === users.length) {
      return false;
    }
    
    this.setItem('users', filteredUsers);
    return true;
  }
  
  // Password operations
  async getPasswords(): Promise<Password[]> {
    return this.getItem<Password>('passwords');
  }

  async getPasswordById(id: string): Promise<Password | null> {
    const passwords = await this.getPasswords();
    return passwords.find(password => password.id === id) || null;
  }

  async createPassword(password: Omit<Password, 'id'>): Promise<Password> {
    const passwords = await this.getPasswords();
    const newPassword = { ...password, id: this.generateId() };
    this.setItem('passwords', [...passwords, newPassword]);
    return newPassword;
  }

  async updatePassword(id: string, passwordData: Partial<Password>): Promise<Password> {
    const passwords = await this.getPasswords();
    const passwordIndex = passwords.findIndex(password => password.id === id);
    
    if (passwordIndex === -1) {
      throw new Error(`Password with id ${id} not found in MySQL database`);
    }
    
    const updatedPassword = { ...passwords[passwordIndex], ...passwordData };
    passwords[passwordIndex] = updatedPassword;
    this.setItem('passwords', passwords);
    return updatedPassword;
  }

  async deletePassword(id: string): Promise<boolean> {
    const passwords = await this.getPasswords();
    const filteredPasswords = passwords.filter(password => password.id !== id);
    
    if (filteredPasswords.length === passwords.length) {
      return false;
    }
    
    this.setItem('passwords', filteredPasswords);
    return true;
  }

  // Category operations
  async getCategories(): Promise<PasswordCategory[]> {
    return this.getItem<PasswordCategory>('categories');
  }

  async getCategoryById(id: string): Promise<PasswordCategory | null> {
    const categories = await this.getCategories();
    return categories.find(category => category.id === id) || null;
  }

  async createCategory(category: Omit<PasswordCategory, 'id'>): Promise<PasswordCategory> {
    const categories = await this.getCategories();
    const newCategory = { ...category, id: this.generateId() };
    this.setItem('categories', [...categories, newCategory]);
    return newCategory;
  }

  async updateCategory(id: string, categoryData: Partial<PasswordCategory>): Promise<PasswordCategory> {
    const categories = await this.getCategories();
    const categoryIndex = categories.findIndex(category => category.id === id);
    
    if (categoryIndex === -1) {
      throw new Error(`Category with id ${id} not found in MySQL database`);
    }
    
    const updatedCategory = { ...categories[categoryIndex], ...categoryData };
    categories[categoryIndex] = updatedCategory;
    this.setItem('categories', categories);
    return updatedCategory;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const categories = await this.getCategories();
    const filteredCategories = categories.filter(category => category.id !== id);
    
    if (filteredCategories.length === categories.length) {
      return false;
    }
    
    this.setItem('categories', filteredCategories);
    return true;
  }

  // Group operations
  async getGroups(): Promise<PermissionGroup[]> {
    return this.getItem<PermissionGroup>('groups');
  }

  async getGroupById(id: string): Promise<PermissionGroup | null> {
    const groups = await this.getGroups();
    return groups.find(group => group.id === id) || null;
  }

  async createGroup(group: Omit<PermissionGroup, 'id'>): Promise<PermissionGroup> {
    const groups = await this.getGroups();
    const newGroup = { ...group, id: this.generateId() };
    this.setItem('groups', [...groups, newGroup]);
    return newGroup;
  }

  async updateGroup(id: string, groupData: Partial<PermissionGroup>): Promise<PermissionGroup> {
    const groups = await this.getGroups();
    const groupIndex = groups.findIndex(group => group.id === id);
    
    if (groupIndex === -1) {
      throw new Error(`Group with id ${id} not found in MySQL database`);
    }
    
    const updatedGroup = { ...groups[groupIndex], ...groupData };
    groups[groupIndex] = updatedGroup;
    this.setItem('groups', groups);
    return updatedGroup;
  }

  async deleteGroup(id: string): Promise<boolean> {
    const groups = await this.getGroups();
    const filteredGroups = groups.filter(group => group.id !== id);
    
    if (filteredGroups.length === groups.length) {
      return false;
    }
    
    this.setItem('groups', filteredGroups);
    return true;
  }

  // Log operations
  async getLogs(): Promise<LogEntry[]> {
    return this.getItem<LogEntry>('logs');
  }

  async createLog(log: Omit<LogEntry, 'id'>): Promise<LogEntry> {
    const logs = await this.getLogs();
    const newLog = { ...log, id: this.generateId() };
    this.setItem('logs', [...logs, newLog]);
    return newLog;
  }

  // Authentication
  async login(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    
    if (user && user.password === password) {
      // Check if user is active
      if (user.active === false) {
        toast({
          title: "Login negado",
          description: "Sua conta está desativada. Entre em contato com o administrador.",
          variant: "destructive"
        });
        return null; // Inactive users can't log in
      }

      localStorage.setItem(`${this.PREFIX}currentUser`, JSON.stringify(user));
      await this.createLog({
        timestamp: Date.now(),
        action: 'login',
        entityType: 'user',
        entityId: user.id,
        description: `Login: ${user.username} (MySQL: ${this.dbConfig.name})`,
        userId: user.id
      });
      return user;
    }
    
    return null;
  }

  async getCurrentUser(): Promise<User | null> {
    const storedUser = localStorage.getItem(`${this.PREFIX}currentUser`);
    return storedUser ? JSON.parse(storedUser) : null;
  }

  async logout(): Promise<void> {
    const currentUser = await this.getCurrentUser();
    
    if (currentUser) {
      await this.createLog({
        timestamp: Date.now(),
        action: 'logout',
        entityType: 'user',
        entityId: currentUser.id,
        description: `Logout: ${currentUser.username} (MySQL: ${this.dbConfig.name})`,
        userId: currentUser.id
      });
    }
    
    localStorage.removeItem(`${this.PREFIX}currentUser`);
  }
}
