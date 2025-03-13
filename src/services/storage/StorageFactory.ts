
import { StorageInterface } from './StorageInterface';
import { LocalStorageService } from './LocalStorageService';
import { MySQLStorageService } from './MySQLStorageService';

// Storage types we support
export type StorageType = 'localStorage' | 'mysql';

// Database configuration interface
export interface DatabaseConfig {
  name: string;
  host: string;
  port: number;
  user: string;
  password: string;
}

// Default database configuration
const DEFAULT_DB_CONFIG: DatabaseConfig = {
  name: 'password_vault',
  host: 'localhost',
  port: 3306,
  user: 'admin',
  password: 'password'
};

// Factory class to get the right storage implementation
export class StorageFactory {
  private static instance: StorageInterface;
  private static storageTypeKey = 'passwordVault_storageType';
  private static dbConfigKey = 'passwordVault_dbConfig';
  
  // Get currently saved storage type from localStorage
  private static getSavedStorageType(): StorageType {
    const savedType = localStorage.getItem(this.storageTypeKey);
    return (savedType as StorageType) || 'localStorage';
  }
  
  // Save current storage type to localStorage
  private static saveStorageType(type: StorageType): void {
    localStorage.setItem(this.storageTypeKey, type);
  }

  // Get currently saved database configuration
  private static getSavedDbConfig(): DatabaseConfig {
    const savedConfig = localStorage.getItem(this.dbConfigKey);
    return savedConfig ? JSON.parse(savedConfig) : DEFAULT_DB_CONFIG;
  }
  
  // Save database configuration to localStorage
  private static saveDbConfig(config: DatabaseConfig): void {
    localStorage.setItem(this.dbConfigKey, JSON.stringify(config));
  }

  // Get the current storage type
  public static get currentType(): StorageType {
    return this.getSavedStorageType();
  }
  
  // Get the current database configuration
  public static get dbConfig(): DatabaseConfig {
    return this.getSavedDbConfig();
  }

  // Get the current storage implementation
  public static getStorage(): StorageInterface {
    if (!this.instance) {
      this.instance = this.createStorage(this.currentType);
    }
    return this.instance;
  }

  // Switch to a different storage implementation
  public static switchStorage(type: StorageType): StorageInterface {
    this.saveStorageType(type);
    this.instance = this.createStorage(type);
    return this.instance;
  }
  
  // Update database configuration
  public static updateDbConfig(config: DatabaseConfig): void {
    this.saveDbConfig(config);
    
    // If we're currently using MySQL, reinitialize the connection
    if (this.currentType === 'mysql' && this.instance) {
      this.instance = this.createStorage('mysql');
    }
  }

  // Create a new storage implementation based on type
  private static createStorage(type: StorageType): StorageInterface {
    switch (type) {
      case 'localStorage':
        return new LocalStorageService();
      case 'mysql':
        return new MySQLStorageService(this.dbConfig);
      default:
        return new LocalStorageService();
    }
  }
}
