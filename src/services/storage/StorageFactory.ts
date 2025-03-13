
import { StorageInterface } from './StorageInterface';
import { LocalStorageService } from './LocalStorageService';

// Storage types we support
export type StorageType = 'localStorage' | 'mysql';

// Factory class to get the right storage implementation
export class StorageFactory {
  private static instance: StorageInterface;
  private static currentType: StorageType = 'localStorage';

  // Get the current storage implementation
  public static getStorage(): StorageInterface {
    if (!this.instance) {
      this.instance = this.createStorage(this.currentType);
    }
    return this.instance;
  }

  // Switch to a different storage implementation
  public static switchStorage(type: StorageType): StorageInterface {
    this.currentType = type;
    this.instance = this.createStorage(type);
    return this.instance;
  }

  // Create a new storage implementation based on type
  private static createStorage(type: StorageType): StorageInterface {
    switch (type) {
      case 'localStorage':
        return new LocalStorageService();
      case 'mysql':
        // In the future, we will return a MySQL implementation here
        // return new MySQLStorageService();
        console.warn('MySQL storage not yet implemented, falling back to localStorage');
        return new LocalStorageService();
      default:
        return new LocalStorageService();
    }
  }
}
