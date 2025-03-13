
import { StorageInterface } from './StorageInterface';
import { User, Password, PasswordCategory, PermissionGroup, LogEntry } from '../../models/types';

export class LocalStorageService implements StorageInterface {
  // Helper method to generate IDs
  private generateId(): string {
    return Date.now().toString();
  }

  // User operations
  async getUsers(): Promise<User[]> {
    const storedUsers = localStorage.getItem('users');
    return storedUsers ? JSON.parse(storedUsers) : [];
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
    const newUser = { ...user, id: this.generateId(), active: user.active !== false }; // Default to active if not specified
    localStorage.setItem('users', JSON.stringify([...users, newUser]));
    return newUser;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const users = await this.getUsers();
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      throw new Error(`User with id ${id} not found`);
    }
    
    const updatedUser = { ...users[userIndex], ...userData };
    users[userIndex] = updatedUser;
    localStorage.setItem('users', JSON.stringify(users));
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    const users = await this.getUsers();
    const filteredUsers = users.filter(user => user.id !== id);
    
    if (filteredUsers.length === users.length) {
      return false;
    }
    
    localStorage.setItem('users', JSON.stringify(filteredUsers));
    return true;
  }

  // Password operations
  async getPasswords(): Promise<Password[]> {
    const storedPasswords = localStorage.getItem('passwords');
    return storedPasswords ? JSON.parse(storedPasswords) : [];
  }

  async getPasswordById(id: string): Promise<Password | null> {
    const passwords = await this.getPasswords();
    return passwords.find(password => password.id === id) || null;
  }

  async createPassword(password: Omit<Password, 'id'>): Promise<Password> {
    const passwords = await this.getPasswords();
    const newPassword = { ...password, id: this.generateId() };
    localStorage.setItem('passwords', JSON.stringify([...passwords, newPassword]));
    return newPassword;
  }

  async updatePassword(id: string, passwordData: Partial<Password>): Promise<Password> {
    const passwords = await this.getPasswords();
    const passwordIndex = passwords.findIndex(password => password.id === id);
    
    if (passwordIndex === -1) {
      throw new Error(`Password with id ${id} not found`);
    }
    
    const updatedPassword = { ...passwords[passwordIndex], ...passwordData };
    passwords[passwordIndex] = updatedPassword;
    localStorage.setItem('passwords', JSON.stringify(passwords));
    return updatedPassword;
  }

  async deletePassword(id: string): Promise<boolean> {
    const passwords = await this.getPasswords();
    const filteredPasswords = passwords.filter(password => password.id !== id);
    
    if (filteredPasswords.length === passwords.length) {
      return false;
    }
    
    localStorage.setItem('passwords', JSON.stringify(filteredPasswords));
    return true;
  }

  // Category operations
  async getCategories(): Promise<PasswordCategory[]> {
    const storedCategories = localStorage.getItem('categories');
    return storedCategories ? JSON.parse(storedCategories) : [];
  }

  async getCategoryById(id: string): Promise<PasswordCategory | null> {
    const categories = await this.getCategories();
    return categories.find(category => category.id === id) || null;
  }

  async createCategory(category: Omit<PasswordCategory, 'id'>): Promise<PasswordCategory> {
    const categories = await this.getCategories();
    const newCategory = { ...category, id: this.generateId() };
    localStorage.setItem('categories', JSON.stringify([...categories, newCategory]));
    return newCategory;
  }

  async updateCategory(id: string, categoryData: Partial<PasswordCategory>): Promise<PasswordCategory> {
    const categories = await this.getCategories();
    const categoryIndex = categories.findIndex(category => category.id === id);
    
    if (categoryIndex === -1) {
      throw new Error(`Category with id ${id} not found`);
    }
    
    const updatedCategory = { ...categories[categoryIndex], ...categoryData };
    categories[categoryIndex] = updatedCategory;
    localStorage.setItem('categories', JSON.stringify(categories));
    return updatedCategory;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const categories = await this.getCategories();
    const filteredCategories = categories.filter(category => category.id !== id);
    
    if (filteredCategories.length === categories.length) {
      return false;
    }
    
    localStorage.setItem('categories', JSON.stringify(filteredCategories));
    return true;
  }

  // Group operations
  async getGroups(): Promise<PermissionGroup[]> {
    const storedGroups = localStorage.getItem('groups');
    return storedGroups ? JSON.parse(storedGroups) : [];
  }

  async getGroupById(id: string): Promise<PermissionGroup | null> {
    const groups = await this.getGroups();
    return groups.find(group => group.id === id) || null;
  }

  async createGroup(group: Omit<PermissionGroup, 'id'>): Promise<PermissionGroup> {
    const groups = await this.getGroups();
    const newGroup = { ...group, id: this.generateId() };
    localStorage.setItem('groups', JSON.stringify([...groups, newGroup]));
    return newGroup;
  }

  async updateGroup(id: string, groupData: Partial<PermissionGroup>): Promise<PermissionGroup> {
    const groups = await this.getGroups();
    const groupIndex = groups.findIndex(group => group.id === id);
    
    if (groupIndex === -1) {
      throw new Error(`Group with id ${id} not found`);
    }
    
    const updatedGroup = { ...groups[groupIndex], ...groupData };
    groups[groupIndex] = updatedGroup;
    localStorage.setItem('groups', JSON.stringify(groups));
    return updatedGroup;
  }

  async deleteGroup(id: string): Promise<boolean> {
    const groups = await this.getGroups();
    const filteredGroups = groups.filter(group => group.id !== id);
    
    if (filteredGroups.length === groups.length) {
      return false;
    }
    
    localStorage.setItem('groups', JSON.stringify(filteredGroups));
    return true;
  }

  // Log operations
  async getLogs(): Promise<LogEntry[]> {
    const storedLogs = localStorage.getItem('logs');
    return storedLogs ? JSON.parse(storedLogs) : [];
  }

  async createLog(log: Omit<LogEntry, 'id'>): Promise<LogEntry> {
    const logs = await this.getLogs();
    const newLog = { 
      ...log, 
      id: this.generateId(),
      timestamp: typeof log.timestamp === 'number' ? new Date(log.timestamp).toISOString() : log.timestamp
    };
    localStorage.setItem('logs', JSON.stringify([...logs, newLog]));
    return newLog;
  }

  // Authentication
  async login(username: string, password: string): Promise<User> {
    const user = await this.getUserByUsername(username);
    
    if (user && user.password === password) {
      // Check if user is active
      if (user.active === false) {
        throw new Error('User account is inactive');
      }

      localStorage.setItem('currentUser', JSON.stringify(user));
      await this.createLog({
        timestamp: new Date().toISOString(),
        action: 'login',
        entityType: 'user',
        entityId: user.id,
        description: `Login: ${user.username}`,
        userId: user.id
      });
      return user;
    }
    
    throw new Error('Invalid username or password');
  }

  async getCurrentUser(): Promise<User | null> {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  async logout(): Promise<void> {
    const currentUser = await this.getCurrentUser();
    
    if (currentUser) {
      await this.createLog({
        timestamp: new Date().toISOString(),
        action: 'logout',
        entityType: 'user',
        entityId: currentUser.id,
        description: `Logout: ${currentUser.username}`,
        userId: currentUser.id
      });
    }
    
    localStorage.removeItem('currentUser');
  }
}
