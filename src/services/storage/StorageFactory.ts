
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
  apiUrl?: string; // Added API URL for backend connection
}

// Default database configuration
const DEFAULT_DB_CONFIG: DatabaseConfig = {
  name: 'password_vault',
  host: 'localhost',
  port: 3306,
  user: 'admin',
  password: 'password',
  apiUrl: 'http://localhost:3000/api' // Default API URL
};

// Factory class to get the right storage implementation
export class StorageFactory {
  private static instance: StorageInterface;
  private static storageTypeKey = 'passwordVault_storageType';
  private static dbConfigKey = 'passwordVault_dbConfig';
  private static serverStatusKey = 'passwordVault_serverStatus';
  
  // Get currently saved storage type from localStorage
  private static getSavedStorageType(): StorageType {
    if (typeof window === 'undefined') return 'localStorage';
    const savedType = localStorage.getItem(this.storageTypeKey);
    return (savedType as StorageType) || 'localStorage';
  }
  
  // Save current storage type to localStorage
  private static saveStorageType(type: StorageType): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.storageTypeKey, type);
  }

  // Get currently saved database configuration
  private static getSavedDbConfig(): DatabaseConfig {
    if (typeof window === 'undefined') return DEFAULT_DB_CONFIG;
    const savedConfig = localStorage.getItem(this.dbConfigKey);
    return savedConfig ? JSON.parse(savedConfig) : DEFAULT_DB_CONFIG;
  }
  
  // Save database configuration to localStorage
  private static saveDbConfig(config: DatabaseConfig): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.dbConfigKey, JSON.stringify(config));
  }

  // Get the server status
  private static getServerStatus(): { connected: boolean, message: string } {
    if (typeof window === 'undefined') return { connected: false, message: 'Node environment detected' };
    const savedStatus = localStorage.getItem(this.serverStatusKey);
    return savedStatus ? JSON.parse(savedStatus) : { connected: false, message: 'Not checked yet' };
  }
  
  // Save server status to localStorage
  private static saveServerStatus(status: { connected: boolean, message: string }): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.serverStatusKey, JSON.stringify(status));
  }

  // Get the current storage type
  public static get currentType(): StorageType {
    return this.getSavedStorageType();
  }
  
  // Get the current database configuration
  public static get dbConfig(): DatabaseConfig {
    return this.getSavedDbConfig();
  }
  
  // Get the current server status
  public static get serverStatus(): { connected: boolean, message: string } {
    return this.getServerStatus();
  }

  // Get the current storage implementation
  public static getStorage(): StorageInterface {
    if (!this.instance) {
      this.instance = this.createStorage(this.currentType);
    }
    return this.instance;
  }

  // Check server connection
  public static async checkServerConnection(): Promise<{ connected: boolean, message: string }> {
    try {
      const config = this.dbConfig;
      const response = await fetch(`${config.apiUrl}/status`);
      
      if (!response.ok) {
        const status = { connected: false, message: `Server error: ${response.status}` };
        this.saveServerStatus(status);
        return status;
      }
      
      const data = await response.json();
      const status = { 
        connected: data.status === 'connected', 
        message: data.message || 'Connected to server'
      };
      
      this.saveServerStatus(status);
      return status;
    } catch (error) {
      console.error("Error checking server connection:", error);
      const status = { connected: false, message: error.message || 'Connection failed' };
      this.saveServerStatus(status);
      return status;
    }
  }

  // Switch to a different storage implementation
  public static switchStorage(type: StorageType): StorageInterface {
    try {
      // Don't try to connect to MySQL if it's not running in a Node.js environment
      if (type === 'mysql' && typeof window !== 'undefined') {
        // Check if the server is available before switching
        this.checkServerConnection().then(status => {
          if (!status.connected) {
            toast({
              title: "Aviso",
              description: `Usando modo de simulação MySQL. ${status.message}`,
              variant: "warning"
            });
          }
        });
      }
      
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
        
        // Check the connection after updating config
        this.checkServerConnection().then(status => {
          if (!status.connected) {
            toast({
              title: "Aviso de Conexão",
              description: `Servidor MySQL em modo de simulação: ${status.message}`,
              variant: "warning"
            });
          } else {
            toast({
              title: "Sucesso",
              description: "Conectado ao banco de dados MySQL.",
              variant: "default"
            });
          }
        });
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
          // Use MySQLStorageService (either real or simulated)
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
