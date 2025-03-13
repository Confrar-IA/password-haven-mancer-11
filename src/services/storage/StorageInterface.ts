
import { User, Password, PasswordCategory, PermissionGroup, LogEntry } from '../../models/types';

export interface StorageInterface {
  // User operations
  getUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  getUserByUsername?(username: string): Promise<User | null>;
  createUser(userData: Omit<User, 'id'>): Promise<User>;
  updateUser(id: string, userData: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<boolean>;
  
  // Password operations
  getPasswords(): Promise<Password[]>;
  getPasswordById(id: string): Promise<Password | null>;
  createPassword(passwordData: Omit<Password, 'id'>): Promise<Password>;
  updatePassword(id: string, passwordData: Partial<Password>): Promise<Password>;
  deletePassword(id: string): Promise<boolean>;
  
  // Category operations
  getCategories(): Promise<PasswordCategory[]>;
  getCategoryById?(id: string): Promise<PasswordCategory | null>;
  createCategory(categoryData: Omit<PasswordCategory, 'id'>): Promise<PasswordCategory>;
  updateCategory(id: string, categoryData: Partial<PasswordCategory>): Promise<PasswordCategory>;
  deleteCategory(id: string): Promise<boolean>;
  
  // Group operations
  getGroups(): Promise<PermissionGroup[]>;
  getGroupById?(id: string): Promise<PermissionGroup | null>;
  createGroup(groupData: Omit<PermissionGroup, 'id'>): Promise<PermissionGroup>;
  updateGroup(id: string, groupData: Partial<PermissionGroup>): Promise<PermissionGroup>;
  deleteGroup(id: string): Promise<boolean>;
  
  // Log operations
  getLogs(): Promise<LogEntry[]>;
  createLog(logData: Omit<LogEntry, 'id'>): Promise<LogEntry>;
  
  // Authentication
  login(username: string, password: string): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  
  // Server connection
  checkServerConnection?(): Promise<boolean>;
}
