
import { StorageInterface } from './StorageInterface';
import { LocalStorageService } from './LocalStorageService';
import { MySQLStorageService } from './MySQLStorageService';
import { toast } from "@/components/ui/use-toast";

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
    if (typeof window === 'undefined') return 'localStorage';
    return this.getSavedStorageType();
  }
  
  // Get the current database configuration
  public static get dbConfig(): DatabaseConfig {
    if (typeof window === 'undefined') return DEFAULT_DB_CONFIG;
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
    try {
      this.saveStorageType(type);
      this.instance = this.createStorage(type);
      return this.instance;
    } catch (error) {
      console.error(`Error switching to ${type} storage:`, error);
      
      // If switching to MySQL fails, fallback to localStorage
      if (type === 'mysql') {
        toast({
          title: "Erro na Conexão",
          description: "Não foi possível conectar ao banco MySQL. Voltando para armazenamento local.",
          variant: "destructive"
        });
        
        this.saveStorageType('localStorage');
        this.instance = this.createStorage('localStorage');
      }
      
      return this.instance;
    }
  }
  
  // Update database configuration
  public static updateDbConfig(config: DatabaseConfig): void {
    this.saveDbConfig(config);
    
    // If we're currently using MySQL, reinitialize the connection
    if (this.currentType === 'mysql' && this.instance) {
      try {
        this.instance = this.createStorage('mysql');
      } catch (error) {
        console.error('Error reconnecting to MySQL with new config:', error);
        toast({
          title: "Erro de Configuração",
          description: "Não foi possível reconectar ao banco com as novas configurações.",
          variant: "destructive"
        });
        
        // Fallback to localStorage
        this.saveStorageType('localStorage');
        this.instance = this.createStorage('localStorage');
      }
    }
  }

  // Create a new storage implementation based on type
  private static createStorage(type: StorageType): StorageInterface {
    switch (type) {
      case 'localStorage':
        return new LocalStorageService();
      case 'mysql':
        try {
          return new MySQLStorageService(this.dbConfig);
        } catch (error) {
          console.error('Failed to create MySQL storage:', error);
          toast({
            title: "Erro na Conexão",
            description: "Falha ao inicializar conexão MySQL. Usando armazenamento local.",
            variant: "destructive"
          });
          this.saveStorageType('localStorage');
          return new LocalStorageService();
        }
      default:
        return new LocalStorageService();
    }
  }
}
