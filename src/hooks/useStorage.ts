
import { useState, useEffect, useCallback } from 'react';
import { StorageFactory, StorageType, DatabaseConfig } from '../services/storage/StorageFactory';
import { User, Password, PasswordCategory, PermissionGroup, LogEntry } from '../models/types';

export function useStorage() {
  // Get the current storage type from StorageFactory
  const [storageType, setStorageType] = useState<StorageType>(StorageFactory.currentType);
  // Get the current database configuration
  const [dbConfig, setDbConfig] = useState<DatabaseConfig>(StorageFactory.dbConfig);
  
  // Get the storage instance
  const storage = StorageFactory.getStorage();
  
  // Update state when storage type changes
  useEffect(() => {
    setStorageType(StorageFactory.currentType);
    setDbConfig(StorageFactory.dbConfig);
  }, []);
  
  // Callback to switch storage type
  const switchStorageType = useCallback((type: StorageType) => {
    StorageFactory.switchStorage(type);
    setStorageType(type);
  }, []);
  
  // Callback to update database configuration
  const updateDbConfig = useCallback((config: DatabaseConfig) => {
    StorageFactory.updateDbConfig(config);
    setDbConfig(config);
  }, []);

  // Returns the storage API and the ability to switch storage types
  return {
    storage,
    storageType,
    switchStorageType,
    dbConfig,
    updateDbConfig
  };
}

// Specialized hooks for each entity type
export function useUsers() {
  const { storage } = useStorage();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load users on mount
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const data = await storage.getUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUsers();
  }, [storage]);
  
  // Methods for user management
  const addUser = useCallback(async (user: Omit<User, 'id'>) => {
    try {
      const newUser = await storage.createUser(user);
      setUsers(prev => [...prev, newUser]);
      return newUser;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  }, [storage]);
  
  const updateUser = useCallback(async (id: string, userData: Partial<User>) => {
    try {
      const updatedUser = await storage.updateUser(id, userData);
      setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }, [storage]);
  
  const deleteUser = useCallback(async (id: string) => {
    try {
      const success = await storage.deleteUser(id);
      if (success) {
        setUsers(prev => prev.filter(user => user.id !== id));
      }
      return success;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }, [storage]);
  
  return { users, loading, addUser, updateUser, deleteUser };
}

export function usePasswords() {
  const { storage } = useStorage();
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load passwords on mount
  useEffect(() => {
    const loadPasswords = async () => {
      setLoading(true);
      try {
        const data = await storage.getPasswords();
        setPasswords(data);
      } catch (error) {
        console.error('Error loading passwords:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPasswords();
  }, [storage]);
  
  // Methods for password management
  const addPassword = useCallback(async (password: Omit<Password, 'id'>) => {
    try {
      const newPassword = await storage.createPassword(password);
      setPasswords(prev => [...prev, newPassword]);
      return newPassword;
    } catch (error) {
      console.error('Error adding password:', error);
      throw error;
    }
  }, [storage]);
  
  const updatePassword = useCallback(async (id: string, passwordData: Partial<Password>) => {
    try {
      const updatedPassword = await storage.updatePassword(id, passwordData);
      setPasswords(prev => prev.map(password => password.id === id ? updatedPassword : password));
      return updatedPassword;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }, [storage]);
  
  const deletePassword = useCallback(async (id: string) => {
    try {
      const success = await storage.deletePassword(id);
      if (success) {
        setPasswords(prev => prev.filter(password => password.id !== id));
      }
      return success;
    } catch (error) {
      console.error('Error deleting password:', error);
      throw error;
    }
  }, [storage]);
  
  return { passwords, loading, addPassword, updatePassword, deletePassword };
}

export function useCategories() {
  const { storage } = useStorage();
  const [categories, setCategories] = useState<PasswordCategory[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const data = await storage.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCategories();
  }, [storage]);
  
  // Methods for category management
  const addCategory = useCallback(async (category: Omit<PasswordCategory, 'id'>) => {
    try {
      const newCategory = await storage.createCategory(category);
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  }, [storage]);
  
  const updateCategory = useCallback(async (id: string, categoryData: Partial<PasswordCategory>) => {
    try {
      const updatedCategory = await storage.updateCategory(id, categoryData);
      setCategories(prev => prev.map(category => category.id === id ? updatedCategory : category));
      return updatedCategory;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }, [storage]);
  
  const deleteCategory = useCallback(async (id: string) => {
    try {
      const success = await storage.deleteCategory(id);
      if (success) {
        setCategories(prev => prev.filter(category => category.id !== id));
      }
      return success;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }, [storage]);
  
  return { categories, loading, addCategory, updateCategory, deleteCategory };
}

export function useGroups() {
  const { storage } = useStorage();
  const [groups, setGroups] = useState<PermissionGroup[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load groups on mount
  useEffect(() => {
    const loadGroups = async () => {
      setLoading(true);
      try {
        const data = await storage.getGroups();
        setGroups(data);
      } catch (error) {
        console.error('Error loading groups:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadGroups();
  }, [storage]);
  
  // Methods for group management
  const addGroup = useCallback(async (group: Omit<PermissionGroup, 'id'>) => {
    try {
      const newGroup = await storage.createGroup(group);
      setGroups(prev => [...prev, newGroup]);
      return newGroup;
    } catch (error) {
      console.error('Error adding group:', error);
      throw error;
    }
  }, [storage]);
  
  const updateGroup = useCallback(async (id: string, groupData: Partial<PermissionGroup>) => {
    try {
      const updatedGroup = await storage.updateGroup(id, groupData);
      setGroups(prev => prev.map(group => group.id === id ? updatedGroup : group));
      return updatedGroup;
    } catch (error) {
      console.error('Error updating group:', error);
      throw error;
    }
  }, [storage]);
  
  const deleteGroup = useCallback(async (id: string) => {
    try {
      const success = await storage.deleteGroup(id);
      if (success) {
        setGroups(prev => prev.filter(group => group.id !== id));
      }
      return success;
    } catch (error) {
      console.error('Error deleting group:', error);
      throw error;
    }
  }, [storage]);
  
  return { groups, loading, addGroup, updateGroup, deleteGroup };
}

export function useLogs() {
  const { storage } = useStorage();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load logs on mount
  useEffect(() => {
    const loadLogs = async () => {
      setLoading(true);
      try {
        const data = await storage.getLogs();
        setLogs(data);
      } catch (error) {
        console.error('Error loading logs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadLogs();
  }, [storage]);
  
  // Method to add a log entry
  const addLog = useCallback(async (log: Omit<LogEntry, 'id'>) => {
    try {
      const newLog = await storage.createLog(log);
      setLogs(prev => [...prev, newLog]);
      return newLog;
    } catch (error) {
      console.error('Error adding log:', error);
      throw error;
    }
  }, [storage]);
  
  return { logs, loading, addLog };
}

export function useAuth() {
  const { storage } = useStorage();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Load current user on mount
  useEffect(() => {
    const loadCurrentUser = async () => {
      setLoading(true);
      try {
        const user = await storage.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Error loading current user:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCurrentUser();
  }, [storage]);
  
  // Login method
  const login = useCallback(async (username: string, password: string) => {
    try {
      const user = await storage.login(username, password);
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }, [storage]);
  
  // Logout method
  const logout = useCallback(async () => {
    try {
      await storage.logout();
      setCurrentUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }, [storage]);
  
  return { currentUser, loading, login, logout };
}
