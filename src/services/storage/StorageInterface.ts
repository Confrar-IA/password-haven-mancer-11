
import { User, Password, PasswordCategory, PermissionGroup, LogEntry } from '../../models/types';

// Interface that defines storage operations
export interface StorageInterface {
  // User operations
  getUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  getUserByUsername(username: string): Promise<User | null>;
  createUser(user: Omit<User, 'id'>): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<boolean>;
  
  // Password operations
  getPasswords(): Promise<Password[]>;
  getPasswordById(id: string): Promise<Password | null>;
  createPassword(password: Omit<Password, 'id'>): Promise<Password>;
  updatePassword(id: string, password: Partial<Password>): Promise<Password>;
  deletePassword(id: string): Promise<boolean>;
  
  // Category operations
  getCategories(): Promise<PasswordCategory[]>;
  getCategoryById(id: string): Promise<PasswordCategory | null>;
  createCategory(category: Omit<PasswordCategory, 'id'>): Promise<PasswordCategory>;
  updateCategory(id: string, category: Partial<PasswordCategory>): Promise<PasswordCategory>;
  deleteCategory(id: string): Promise<boolean>;
  
  // Group operations
  getGroups(): Promise<PermissionGroup[]>;
  getGroupById(id: string): Promise<PermissionGroup | null>;
  createGroup(group: Omit<PermissionGroup, 'id'>): Promise<PermissionGroup>;
  updateGroup(id: string, group: Partial<PermissionGroup>): Promise<PermissionGroup>;
  deleteGroup(id: string): Promise<boolean>;
  
  // Log operations
  getLogs(): Promise<LogEntry[]>;
  createLog(log: Omit<LogEntry, 'id'>): Promise<LogEntry>;
  
  // Authentication
  login(username: string, password: string): Promise<User | null>;
  getCurrentUser(): Promise<User | null>;
  logout(): Promise<void>;
}
