
// Export shared types from PasswordVault
export interface User {
  id: string;
  username: string;
  fullName: string;
  role: 'admin' | 'user';
  groups: string[];
  password?: string;
  active?: boolean;
  lastLogin?: string | null;
  created?: string;
}

export interface Password {
  id: string;
  title: string;
  username: string;
  password?: string;
  url?: string;
  category?: string;
  groupId: string;
  created?: string;
  updated?: string;
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
  timestamp: string;
  action: 'login' | 'logout' | 'create' | 'update' | 'delete';
  entityType?: 'password' | 'user' | 'category' | 'group';
  entityId?: string;
  description?: string;
  details?: string;
  userId: string;
}
