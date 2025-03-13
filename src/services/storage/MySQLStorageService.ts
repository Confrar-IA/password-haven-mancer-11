
import { StorageInterface } from './StorageInterface';
import { User, Password, PasswordCategory, PermissionGroup, LogEntry } from '../../models/types';
import { toast } from "@/components/ui/use-toast";
import { DatabaseConfig } from './StorageFactory';
import mysql from 'mysql2/promise';
import fs from 'fs';

export class MySQLStorageService implements StorageInterface {
  private readonly dbConfig: DatabaseConfig;
  private pool: mysql.Pool | null = null;
  private isConnected: boolean = false;
  
  constructor(dbConfig: DatabaseConfig) {
    this.dbConfig = dbConfig;
    this.initializeDatabase();
  }
  
  // Initialize database connection pool
  private async initializeDatabase() {
    try {
      // Create connection pool
      this.pool = mysql.createPool({
        host: this.dbConfig.host,
        port: this.dbConfig.port,
        user: this.dbConfig.user,
        password: this.dbConfig.password,
        database: this.dbConfig.name,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
      
      // Test connection
      const connection = await this.pool.getConnection();
      console.log(`MySQL connection established to ${this.dbConfig.name} database`);
      this.isConnected = true;
      connection.release();
      
      // Initialize schema if needed
      await this.initializeSchema();
      
      toast({
        title: "Banco de Dados Conectado",
        description: `Conexão com MySQL (${this.dbConfig.name}) estabelecida com sucesso.`,
      });
    } catch (error) {
      console.error('Failed to connect to MySQL database:', error);
      this.isConnected = false;
      this.pool = null;
      
      toast({
        title: "Falha na Conexão",
        description: "Não foi possível conectar ao banco de dados MySQL. Verifique as configurações.",
        variant: "destructive",
      });
      
      // Store current user state before switching to localStorage
      const currentUserJSON = localStorage.getItem(`mysql_${this.dbConfig.name}_currentUser`);
      
      // Switch back to localStorage automatically
      if (typeof window !== 'undefined') {
        localStorage.setItem('passwordVault_storageType', 'localStorage');
        // Preserve the current user if it exists
        if (currentUserJSON) {
          localStorage.setItem('localStorage_currentUser', currentUserJSON);
        }
        
        // Reload page to apply storage type change
        window.location.reload();
      }
    }
  }
  
  // Initialize database schema using the schema.sql file
  private async initializeSchema() {
    if (!this.pool) return;
    
    try {
      // Read schema file
      const schemaPath = '/src/services/storage/schema.sql';
      let schemaSQL = '';
      
      try {
        // In a browser environment, we can't read files directly
        // This would need to be handled differently in a real app
        // For this demo, we'll use a simplified approach
        const response = await fetch(schemaPath);
        schemaSQL = await response.text();
      } catch (fetchError) {
        console.error('Error fetching schema file:', fetchError);
        // Fallback: Use the schema directly
        schemaSQL = `
        -- Users Table
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(50) PRIMARY KEY,
          username VARCHAR(100) NOT NULL UNIQUE,
          fullName VARCHAR(255) NOT NULL,
          role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
          password VARCHAR(255),
          active BOOLEAN NOT NULL DEFAULT TRUE
        );
        
        -- Permission Groups Table
        CREATE TABLE IF NOT EXISTS permission_groups (
          id VARCHAR(50) PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          description TEXT
        );
        
        -- User Group Relationship (Many-to-Many)
        CREATE TABLE IF NOT EXISTS user_groups (
          user_id VARCHAR(50) NOT NULL,
          group_id VARCHAR(50) NOT NULL,
          PRIMARY KEY (user_id, group_id),
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (group_id) REFERENCES permission_groups(id) ON DELETE CASCADE
        );
        
        -- Password Categories Table
        CREATE TABLE IF NOT EXISTS password_categories (
          id VARCHAR(50) PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          description TEXT
        );
        
        -- Passwords Table
        CREATE TABLE IF NOT EXISTS passwords (
          id VARCHAR(50) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          username VARCHAR(255) NOT NULL,
          password VARCHAR(255),
          url TEXT,
          category_id VARCHAR(50),
          group_id VARCHAR(50) NOT NULL,
          FOREIGN KEY (category_id) REFERENCES password_categories(id) ON DELETE SET NULL,
          FOREIGN KEY (group_id) REFERENCES permission_groups(id) ON DELETE CASCADE
        );
        
        -- Activity Logs Table
        CREATE TABLE IF NOT EXISTS logs (
          id VARCHAR(50) PRIMARY KEY,
          timestamp BIGINT NOT NULL,
          action ENUM('login', 'logout', 'create', 'update', 'delete') NOT NULL,
          entity_type ENUM('password', 'user', 'category', 'group') NOT NULL,
          entity_id VARCHAR(50) NOT NULL,
          description TEXT NOT NULL,
          user_id VARCHAR(50) NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        
        -- Indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_passwords_group ON passwords(group_id);
        CREATE INDEX IF NOT EXISTS idx_passwords_category ON passwords(category_id);
        CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON logs(timestamp);
        CREATE INDEX IF NOT EXISTS idx_logs_action ON logs(action);
        CREATE INDEX IF NOT EXISTS idx_logs_entity_type ON logs(entity_type);
        `;
      }
      
      // Execute schema SQL statements one by one
      const statements = schemaSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);
      
      for (const stmt of statements) {
        await this.pool.execute(stmt);
      }
      
      console.log('Database schema initialized successfully');
    } catch (error) {
      console.error('Error initializing database schema:', error);
    }
  }
  
  // Generate unique ID
  private generateId(): string {
    return Date.now().toString();
  }
  
  // Execute query with error handling
  private async query<T>(sql: string, params: any[] = []): Promise<T> {
    if (!this.pool) {
      throw new Error('Database connection not established');
    }
    
    try {
      const [results] = await this.pool.execute(sql, params);
      return results as T;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  // User operations
  async getUsers(): Promise<User[]> {
    return this.query<User[]>('SELECT * FROM users');
  }

  async getUserById(id: string): Promise<User | null> {
    const users = await this.query<User[]>('SELECT * FROM users WHERE id = ?', [id]);
    return users.length > 0 ? users[0] : null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const users = await this.query<User[]>('SELECT * FROM users WHERE username = ?', [username]);
    return users.length > 0 ? users[0] : null;
  }

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    const id = this.generateId();
    const active = user.active !== false;
    
    await this.query(
      'INSERT INTO users (id, username, fullName, role, password, active) VALUES (?, ?, ?, ?, ?, ?)',
      [id, user.username, user.fullName, user.role, user.password, active]
    );
    
    return { ...user, id, active };
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    // First get the current user data
    const currentUser = await this.getUserById(id);
    if (!currentUser) {
      throw new Error(`User with id ${id} not found in database`);
    }
    
    // Prepare update fields and values
    const updateFields: string[] = [];
    const values: any[] = [];
    
    for (const [key, value] of Object.entries(userData)) {
      if (key !== 'id') { // Don't update id
        updateFields.push(`${key} = ?`);
        values.push(value);
      }
    }
    
    // Add id to values array for WHERE clause
    values.push(id);
    
    // Execute update query
    await this.query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      values
    );
    
    // Return updated user data
    return { ...currentUser, ...userData };
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.query<mysql.ResultSetHeader>(
      'DELETE FROM users WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
  
  // Password operations
  async getPasswords(): Promise<Password[]> {
    return this.query<Password[]>('SELECT * FROM passwords');
  }

  async getPasswordById(id: string): Promise<Password | null> {
    const passwords = await this.query<Password[]>('SELECT * FROM passwords WHERE id = ?', [id]);
    return passwords.length > 0 ? passwords[0] : null;
  }

  async createPassword(password: Omit<Password, 'id'>): Promise<Password> {
    const id = this.generateId();
    
    await this.query(
      'INSERT INTO passwords (id, title, username, password, url, category_id, group_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, password.title, password.username, password.password, password.url, password.category, password.groupId]
    );
    
    return { ...password, id };
  }

  async updatePassword(id: string, passwordData: Partial<Password>): Promise<Password> {
    // First get the current password data
    const currentPassword = await this.getPasswordById(id);
    if (!currentPassword) {
      throw new Error(`Password with id ${id} not found in database`);
    }
    
    // Prepare update fields and values
    const updateFields: string[] = [];
    const values: any[] = [];
    
    for (const [key, value] of Object.entries(passwordData)) {
      if (key !== 'id') { // Don't update id
        // Handle column name differences between object properties and DB columns
        let dbColumn = key;
        if (key === 'category') dbColumn = 'category_id';
        if (key === 'groupId') dbColumn = 'group_id';
        
        updateFields.push(`${dbColumn} = ?`);
        values.push(value);
      }
    }
    
    // Add id to values array for WHERE clause
    values.push(id);
    
    // Execute update query
    await this.query(
      `UPDATE passwords SET ${updateFields.join(', ')} WHERE id = ?`,
      values
    );
    
    // Return updated password data
    return { ...currentPassword, ...passwordData };
  }

  async deletePassword(id: string): Promise<boolean> {
    const result = await this.query<mysql.ResultSetHeader>(
      'DELETE FROM passwords WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  // Category operations
  async getCategories(): Promise<PasswordCategory[]> {
    return this.query<PasswordCategory[]>('SELECT * FROM password_categories');
  }

  async getCategoryById(id: string): Promise<PasswordCategory | null> {
    const categories = await this.query<PasswordCategory[]>(
      'SELECT * FROM password_categories WHERE id = ?',
      [id]
    );
    return categories.length > 0 ? categories[0] : null;
  }

  async createCategory(category: Omit<PasswordCategory, 'id'>): Promise<PasswordCategory> {
    const id = this.generateId();
    
    await this.query(
      'INSERT INTO password_categories (id, name, description) VALUES (?, ?, ?)',
      [id, category.name, category.description]
    );
    
    return { ...category, id };
  }

  async updateCategory(id: string, categoryData: Partial<PasswordCategory>): Promise<PasswordCategory> {
    // First get the current category data
    const currentCategory = await this.getCategoryById(id);
    if (!currentCategory) {
      throw new Error(`Category with id ${id} not found in database`);
    }
    
    // Prepare update fields and values
    const updateFields: string[] = [];
    const values: any[] = [];
    
    for (const [key, value] of Object.entries(categoryData)) {
      if (key !== 'id') { // Don't update id
        updateFields.push(`${key} = ?`);
        values.push(value);
      }
    }
    
    // Add id to values array for WHERE clause
    values.push(id);
    
    // Execute update query
    await this.query(
      `UPDATE password_categories SET ${updateFields.join(', ')} WHERE id = ?`,
      values
    );
    
    // Return updated category data
    return { ...currentCategory, ...categoryData };
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await this.query<mysql.ResultSetHeader>(
      'DELETE FROM password_categories WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  // Group operations
  async getGroups(): Promise<PermissionGroup[]> {
    return this.query<PermissionGroup[]>('SELECT * FROM permission_groups');
  }

  async getGroupById(id: string): Promise<PermissionGroup | null> {
    const groups = await this.query<PermissionGroup[]>(
      'SELECT * FROM permission_groups WHERE id = ?',
      [id]
    );
    return groups.length > 0 ? groups[0] : null;
  }

  async createGroup(group: Omit<PermissionGroup, 'id'>): Promise<PermissionGroup> {
    const id = this.generateId();
    
    await this.query(
      'INSERT INTO permission_groups (id, name, description) VALUES (?, ?, ?)',
      [id, group.name, group.description]
    );
    
    return { ...group, id };
  }

  async updateGroup(id: string, groupData: Partial<PermissionGroup>): Promise<PermissionGroup> {
    // First get the current group data
    const currentGroup = await this.getGroupById(id);
    if (!currentGroup) {
      throw new Error(`Group with id ${id} not found in database`);
    }
    
    // Prepare update fields and values
    const updateFields: string[] = [];
    const values: any[] = [];
    
    for (const [key, value] of Object.entries(groupData)) {
      if (key !== 'id') { // Don't update id
        updateFields.push(`${key} = ?`);
        values.push(value);
      }
    }
    
    // Add id to values array for WHERE clause
    values.push(id);
    
    // Execute update query
    await this.query(
      `UPDATE permission_groups SET ${updateFields.join(', ')} WHERE id = ?`,
      values
    );
    
    // Return updated group data
    return { ...currentGroup, ...groupData };
  }

  async deleteGroup(id: string): Promise<boolean> {
    const result = await this.query<mysql.ResultSetHeader>(
      'DELETE FROM permission_groups WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  // Log operations
  async getLogs(): Promise<LogEntry[]> {
    return this.query<LogEntry[]>('SELECT * FROM logs ORDER BY timestamp DESC');
  }

  async createLog(log: Omit<LogEntry, 'id'>): Promise<LogEntry> {
    const id = this.generateId();
    
    // Convert enum types to match database schema
    const action = log.action;
    const entityType = log.entityType;
    
    await this.query(
      'INSERT INTO logs (id, timestamp, action, entity_type, entity_id, description, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, log.timestamp, action, entityType, log.entityId, log.description, log.userId]
    );
    
    return { ...log, id };
  }

  // Authentication
  async login(username: string, password: string): Promise<User | null> {
    try {
      const users = await this.query<User[]>(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password]
      );
      
      if (users.length === 0) {
        return null;
      }
      
      const user = users[0];
      
      // Check if user is active
      if (user.active === false) {
        toast({
          title: "Login negado",
          description: "Sua conta está desativada. Entre em contato com o administrador.",
          variant: "destructive"
        });
        return null; // Inactive users can't log in
      }
      
      // Store current user in localStorage for session persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem(`mysql_${this.dbConfig.name}_currentUser`, JSON.stringify(user));
      }
      
      // Log login action
      await this.createLog({
        timestamp: Date.now(),
        action: 'login',
        entityType: 'user',
        entityId: user.id,
        description: `Login: ${user.username} (MySQL: ${this.dbConfig.name})`,
        userId: user.id
      });
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (typeof window === 'undefined') {
      return null;
    }
    
    const storedUser = localStorage.getItem(`mysql_${this.dbConfig.name}_currentUser`);
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
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`mysql_${this.dbConfig.name}_currentUser`);
      }
    }
  }
}
