// Export shared types from PasswordVault
export interface User {
  id: string;
  username: string;
  fullName: string;
  role: 'admin' | 'user';
  groups: string[];
  password?: string;
  active?: boolean; // New field to indicate if user is active or disabled
}

export interface Password {
  id: string;
  title: string;
  username: string;
  password?: string;
  url?: string;
  category?: string;
  groupId: string;
}

export interface PasswordCategory {
  id: string;
  name: string;
  description?: string;
}

export interface PermissionGroup {
  id: string;
  name: string;
  description: string;
}

export interface LogEntry {
  id: string;
  timestamp: number;
  action: 'login' | 'logout' | 'create' | 'update' | 'delete';
  entityType: 'password' | 'user' | 'category' | 'group';
  entityId: string;
  description: string;
  userId: string;
}
