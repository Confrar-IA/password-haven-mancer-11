
import { StorageInterface } from './StorageInterface';
import { LocalStorageService } from './LocalStorageService';
import { MySQLStorageService } from './MySQLStorageService';

// Storage types we support
export type StorageType = 'localStorage' | 'mysql';

// Factory class to get the right storage implementation
export class StorageFactory {
  private static instance: StorageInterface;
  private static storageTypeKey = 'passwordVault_storageType';
  
  // Get currently saved storage type from localStorage
  private static getSavedStorageType(): StorageType {
    const savedType = localStorage.getItem(this.storageTypeKey);
    return (savedType as StorageType) || 'localStorage';
  }
  
  // Save current storage type to localStorage
  private static saveStorageType(type: StorageType): void {
    localStorage.setItem(this.storageTypeKey, type);
  }

  // Get the current storage type
  public static get currentType(): StorageType {
    return this.getSavedStorageType();
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

  // Create a new storage implementation based on type
  private static createStorage(type: StorageType): StorageInterface {
    switch (type) {
      case 'localStorage':
        return new LocalStorageService();
      case 'mysql':
        return new MySQLStorageService();
      default:
        return new LocalStorageService();
    }
  }
}
