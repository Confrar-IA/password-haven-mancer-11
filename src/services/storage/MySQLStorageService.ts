
import { StorageInterface } from './StorageInterface';
import { User, Password, PasswordCategory, PermissionGroup, LogEntry } from '../../models/types';
import { toast } from "@/components/ui/use-toast";
import { DatabaseConfig } from './StorageFactory';

// Uma implementação simulada de MySQL usando localStorage
export class MySQLStorageService implements StorageInterface {
  private readonly dbConfig: DatabaseConfig;
  private prefix: string;
  private isConnected: boolean = false;
  
  constructor(dbConfig: DatabaseConfig) {
    this.dbConfig = dbConfig;
    this.prefix = `mysql_${dbConfig.name}_`;
    this.initializeDatabase();
  }
  
  // Inicializar o banco de dados simulado
  private async initializeDatabase() {
    try {
      console.log(`Initializing simulated MySQL database: ${this.dbConfig.name}`);
      
      // Verificar se já temos tabelas inicializadas
      const hasUsers = localStorage.getItem(`${this.prefix}users`);
      
      if (!hasUsers) {
        // Inicializar tabelas vazias
        localStorage.setItem(`${this.prefix}users`, JSON.stringify([]));
        localStorage.setItem(`${this.prefix}passwords`, JSON.stringify([]));
        localStorage.setItem(`${this.prefix}password_categories`, JSON.stringify([]));
        localStorage.setItem(`${this.prefix}permission_groups`, JSON.stringify([]));
        localStorage.setItem(`${this.prefix}logs`, JSON.stringify([]));
      }
      
      this.isConnected = true;
      
      toast({
        title: "Modo MySQL Simulado",
        description: `Conectado ao banco de dados simulado (${this.dbConfig.name}).`,
      });
    } catch (error) {
      console.error('Erro ao inicializar banco MySQL simulado:', error);
      this.isConnected = false;
      
      toast({
        title: "Erro na Conexão",
        description: "Não foi possível inicializar o banco de dados MySQL simulado.",
        variant: "destructive",
      });
      
      throw error;
    }
  }
  
  // Gerar ID único
  private generateId(): string {
    return Date.now().toString();
  }
  
  // Operações de usuário
  async getUsers(): Promise<User[]> {
    const users = localStorage.getItem(`${this.prefix}users`);
    return users ? JSON.parse(users) : [];
  }

  async getUserById(id: string): Promise<User | null> {
    const users = await this.getUsers();
    return users.find(user => user.id === id) || null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const users = await this.getUsers();
    return users.find(user => user.username === username) || null;
  }

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    const id = this.generateId();
    const active = user.active !== false;
    const newUser = { ...user, id, active };
    
    const users = await this.getUsers();
    users.push(newUser);
    localStorage.setItem(`${this.prefix}users`, JSON.stringify(users));
    
    return newUser;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const users = await this.getUsers();
    const index = users.findIndex(user => user.id === id);
    
    if (index === -1) {
      throw new Error(`User with id ${id} not found`);
    }
    
    const updatedUser = { ...users[index], ...userData };
    users[index] = updatedUser;
    localStorage.setItem(`${this.prefix}users`, JSON.stringify(users));
    
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    const users = await this.getUsers();
    const filteredUsers = users.filter(user => user.id !== id);
    
    if (filteredUsers.length === users.length) {
      return false; // User not found
    }
    
    localStorage.setItem(`${this.prefix}users`, JSON.stringify(filteredUsers));
    return true;
  }
  
  // Operações de senha
  async getPasswords(): Promise<Password[]> {
    const passwords = localStorage.getItem(`${this.prefix}passwords`);
    return passwords ? JSON.parse(passwords) : [];
  }

  async getPasswordById(id: string): Promise<Password | null> {
    const passwords = await this.getPasswords();
    return passwords.find(password => password.id === id) || null;
  }

  async createPassword(password: Omit<Password, 'id'>): Promise<Password> {
    const id = this.generateId();
    const newPassword = { ...password, id };
    
    const passwords = await this.getPasswords();
    passwords.push(newPassword);
    localStorage.setItem(`${this.prefix}passwords`, JSON.stringify(passwords));
    
    return newPassword;
  }

  async updatePassword(id: string, passwordData: Partial<Password>): Promise<Password> {
    const passwords = await this.getPasswords();
    const index = passwords.findIndex(password => password.id === id);
    
    if (index === -1) {
      throw new Error(`Password with id ${id} not found`);
    }
    
    const updatedPassword = { ...passwords[index], ...passwordData };
    passwords[index] = updatedPassword;
    localStorage.setItem(`${this.prefix}passwords`, JSON.stringify(passwords));
    
    return updatedPassword;
  }

  async deletePassword(id: string): Promise<boolean> {
    const passwords = await this.getPasswords();
    const filteredPasswords = passwords.filter(password => password.id !== id);
    
    if (filteredPasswords.length === passwords.length) {
      return false; // Password not found
    }
    
    localStorage.setItem(`${this.prefix}passwords`, JSON.stringify(filteredPasswords));
    return true;
  }

  // Operações de categoria
  async getCategories(): Promise<PasswordCategory[]> {
    const categories = localStorage.getItem(`${this.prefix}password_categories`);
    return categories ? JSON.parse(categories) : [];
  }

  async getCategoryById(id: string): Promise<PasswordCategory | null> {
    const categories = await this.getCategories();
    return categories.find(category => category.id === id) || null;
  }

  async createCategory(category: Omit<PasswordCategory, 'id'>): Promise<PasswordCategory> {
    const id = this.generateId();
    const newCategory = { ...category, id };
    
    const categories = await this.getCategories();
    categories.push(newCategory);
    localStorage.setItem(`${this.prefix}password_categories`, JSON.stringify(categories));
    
    return newCategory;
  }

  async updateCategory(id: string, categoryData: Partial<PasswordCategory>): Promise<PasswordCategory> {
    const categories = await this.getCategories();
    const index = categories.findIndex(category => category.id === id);
    
    if (index === -1) {
      throw new Error(`Category with id ${id} not found`);
    }
    
    const updatedCategory = { ...categories[index], ...categoryData };
    categories[index] = updatedCategory;
    localStorage.setItem(`${this.prefix}password_categories`, JSON.stringify(categories));
    
    return updatedCategory;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const categories = await this.getCategories();
    const filteredCategories = categories.filter(category => category.id !== id);
    
    if (filteredCategories.length === categories.length) {
      return false; // Category not found
    }
    
    localStorage.setItem(`${this.prefix}password_categories`, JSON.stringify(filteredCategories));
    return true;
  }

  // Operações de grupo
  async getGroups(): Promise<PermissionGroup[]> {
    const groups = localStorage.getItem(`${this.prefix}permission_groups`);
    return groups ? JSON.parse(groups) : [];
  }

  async getGroupById(id: string): Promise<PermissionGroup | null> {
    const groups = await this.getGroups();
    return groups.find(group => group.id === id) || null;
  }

  async createGroup(group: Omit<PermissionGroup, 'id'>): Promise<PermissionGroup> {
    const id = this.generateId();
    const newGroup = { ...group, id };
    
    const groups = await this.getGroups();
    groups.push(newGroup);
    localStorage.setItem(`${this.prefix}permission_groups`, JSON.stringify(groups));
    
    return newGroup;
  }

  async updateGroup(id: string, groupData: Partial<PermissionGroup>): Promise<PermissionGroup> {
    const groups = await this.getGroups();
    const index = groups.findIndex(group => group.id === id);
    
    if (index === -1) {
      throw new Error(`Group with id ${id} not found`);
    }
    
    const updatedGroup = { ...groups[index], ...groupData };
    groups[index] = updatedGroup;
    localStorage.setItem(`${this.prefix}permission_groups`, JSON.stringify(groups));
    
    return updatedGroup;
  }

  async deleteGroup(id: string): Promise<boolean> {
    const groups = await this.getGroups();
    const filteredGroups = groups.filter(group => group.id !== id);
    
    if (filteredGroups.length === groups.length) {
      return false; // Group not found
    }
    
    localStorage.setItem(`${this.prefix}permission_groups`, JSON.stringify(filteredGroups));
    return true;
  }

  // Operações de log
  async getLogs(): Promise<LogEntry[]> {
    const logs = localStorage.getItem(`${this.prefix}logs`);
    return logs ? JSON.parse(logs) : [];
  }

  async createLog(log: Omit<LogEntry, 'id'>): Promise<LogEntry> {
    const id = this.generateId();
    const newLog = { ...log, id };
    
    const logs = await this.getLogs();
    logs.push(newLog);
    localStorage.setItem(`${this.prefix}logs`, JSON.stringify(logs));
    
    return newLog;
  }

  // Autenticação
  async login(username: string, password: string): Promise<User | null> {
    try {
      const users = await this.getUsers();
      const user = users.find(u => u.username === username && u.password === password);
      
      if (!user) {
        return null;
      }
      
      // Verificar se o usuário está ativo
      if (user.active === false) {
        toast({
          title: "Login negado",
          description: "Sua conta está desativada. Entre em contato com o administrador.",
          variant: "destructive"
        });
        return null; // Usuários inativos não podem fazer login
      }
      
      // Armazenar usuário atual no localStorage para persistência de sessão
      localStorage.setItem(`${this.prefix}currentUser`, JSON.stringify(user));
      
      // Registrar ação de login
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
      console.error('Erro de login:', error);
      return null;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const storedUser = localStorage.getItem(`${this.prefix}currentUser`);
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
      
      localStorage.removeItem(`${this.prefix}currentUser`);
    }
  }
}
