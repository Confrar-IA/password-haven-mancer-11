
import { StorageInterface } from './StorageInterface';
import { LocalStorageService } from './LocalStorageService';
import { MySQLStorageService } from './MySQLStorageService';
import { toast } from "@/components/ui/use-toast";

// Define storage type
export type StorageType = 'localStorage' | 'mysql';

// Define database configuration interface
export interface DatabaseConfig {
  name: string;
  host: string;
  port: number;
  user: string;
  password: string;
  apiUrl: string;
}

/**
 * Storage Factory
 * 
 * This factory creates and manages storage service instances.
 */
export class StorageFactory {
  private static instance: StorageInterface | null = null;
  static currentType: StorageType = 'localStorage';
  
  // Default database configuration
  static dbConfig: DatabaseConfig = {
    name: 'password_vault',
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    apiUrl: 'http://localhost:3000/api',
  };
  
  /**
   * Get or create a storage service instance
   */
  static getStorage(): StorageInterface {
    if (!this.instance) {
      // Check if storage type is stored in localStorage
      const storedType = localStorage.getItem('storageType') as StorageType;
      if (storedType) {
        this.currentType = storedType;
      }
      
      // Check if database config is stored in localStorage
      const storedConfig = localStorage.getItem('dbConfig');
      if (storedConfig) {
        try {
          this.dbConfig = JSON.parse(storedConfig);
        } catch (error) {
          console.error('Error parsing stored database config:', error);
        }
      }
      
      // Create instance based on type
      this.createStorageInstance();
    }
    return this.instance!;
  }
  
  /**
   * Create a storage instance based on the current type
   */
  private static createStorageInstance(): void {
    switch (this.currentType) {
      case 'mysql':
        try {
          this.instance = new MySQLStorageService(this.dbConfig);
        } catch (error) {
          console.error('Error creating MySQL storage instance:', error);
          
          // Fallback to localStorage if MySQL fails
          this.instance = new LocalStorageService();
          this.currentType = 'localStorage';
          
          toast({
            title: "Erro de configuração",
            description: "Não foi possível conectar ao MySQL. Usando armazenamento local.",
            variant: "destructive"
          });
        }
        break;
      case 'localStorage':
      default:
        this.instance = new LocalStorageService();
        break;
    }
  }
  
  /**
   * Switch to a different storage type
   */
  static switchStorage(type: StorageType): StorageInterface {
    // If same type, return current instance
    if (type === this.currentType && this.instance) {
      return this.instance;
    }
    
    // Store the new type in localStorage
    localStorage.setItem('storageType', type);
    this.currentType = type;
    
    // Create new instance with the specified type
    this.instance = null;
    this.createStorageInstance();
    
    // If switching to MySQL, check connection
    if (type === 'mysql') {
      this.checkServerConnection();
    }
    
    return this.instance!;
  }
  
  /**
   * Update database configuration
   */
  static updateDbConfig(config: DatabaseConfig): void {
    this.dbConfig = config;
    
    // Store config in localStorage
    localStorage.setItem('dbConfig', JSON.stringify(config));
    
    // If current type is MySQL, recreate instance with new config
    if (this.currentType === 'mysql') {
      this.instance = null;
      this.createStorageInstance();
      
      // Check connection with new config
      this.checkServerConnection();
    }
  }
  
  /**
   * Check MySQL server connection
   */
  static async checkServerConnection(): Promise<boolean> {
    // Only check if MySQL is the current type
    if (this.currentType !== 'mysql' || !this.instance) {
      return false;
    }
    
    try {
      const mysqlInstance = this.instance as MySQLStorageService;
      const connected = await mysqlInstance.checkServerConnection();
      
      if (!connected) {
        toast({
          title: "Informação",
          description: "Servidor MySQL não encontrado. Usando modo de simulação.",
          variant: "default"
        });
      }
      
      return connected;
    } catch (error) {
      console.error('Error checking server connection:', error);
      
      toast({
        title: "Erro de conexão",
        description: "Não foi possível verificar a conexão com o servidor MySQL.",
        variant: "destructive"
      });
      
      return false;
    }
  }
}
