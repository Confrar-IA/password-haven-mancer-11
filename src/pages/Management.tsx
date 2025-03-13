
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManager from '../components/UserManager';
import CategoryList from '../components/CategoryList';
import { Card, CardContent } from "@/components/ui/card";
import { User, PermissionGroup, PasswordCategory, LogEntry } from '../components/PasswordVault';
import { UserPlus, Shield, Tag } from 'lucide-react';

interface ManagementProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  groups: PermissionGroup[];
  setGroups: React.Dispatch<React.SetStateAction<PermissionGroup[]>>;
  categories: PasswordCategory[];
  setCategories: React.Dispatch<React.SetStateAction<PasswordCategory[]>>;
  logs?: LogEntry[];
  logAction?: (action: LogEntry['action'], entityType: LogEntry['entityType'], entityId: string, description: string) => void;
}

const Management: React.FC<ManagementProps> = ({ 
  users, 
  setUsers, 
  groups, 
  setGroups, 
  categories, 
  setCategories,
  logs,
  logAction
}) => {
  // Handle user actions with logging
  const handleAddUser = (user: User) => {
    setUsers([...users, user]);
    if (logAction) {
      logAction('create', 'user', user.id, `Novo usuário criado: ${user.username}`);
    }
  };

  const handleDeleteUser = (id: string) => {
    const userToDelete = users.find(u => u.id === id);
    setUsers(users.filter(u => u.id !== id));
    if (logAction && userToDelete) {
      logAction('delete', 'user', id, `Usuário excluído: ${userToDelete.username}`);
    }
  };

  // Handle group actions with logging
  const handleAddGroup = (group: PermissionGroup) => {
    setGroups([...groups, group]);
    if (logAction) {
      logAction('create', 'group', group.id, `Novo grupo criado: ${group.name}`);
    }
  };

  const handleDeleteGroup = (id: string) => {
    const groupToDelete = groups.find(g => g.id === id);
    setGroups(groups.filter(g => g.id !== id));
    if (logAction && groupToDelete) {
      logAction('delete', 'group', id, `Grupo excluído: ${groupToDelete.name}`);
    }
  };

  // Handle category actions with logging
  const handleAddCategory = (category: PasswordCategory) => {
    setCategories([...categories, category]);
    if (logAction) {
      logAction('create', 'category', category.id, `Nova categoria criada: ${category.name}`);
    }
  };

  const handleDeleteCategory = (id: string) => {
    const categoryToDelete = categories.find(c => c.id === id);
    setCategories(categories.filter(c => c.id !== id));
    if (logAction && categoryToDelete) {
      logAction('delete', 'category', id, `Categoria excluída: ${categoryToDelete.name}`);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-background text-foreground">
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-2xl font-semibold mb-4">Gerenciamento</h2>
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Usuários
              </TabsTrigger>
              <TabsTrigger value="groups" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Grupos de Permissão
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Categorias
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-4 mt-4">
              <UserManager 
                users={users} 
                setUsers={setUsers} 
                groups={groups} 
                setGroups={setGroups} 
                onAddUser={handleAddUser}
                onDeleteUser={handleDeleteUser}
                initialTab="users" 
              />
            </TabsContent>

            <TabsContent value="groups" className="space-y-4 mt-4">
              <UserManager 
                users={users} 
                setUsers={setUsers} 
                groups={groups} 
                setGroups={setGroups} 
                onAddGroup={handleAddGroup}
                onDeleteGroup={handleDeleteGroup}
                initialTab="groups" 
              />
            </TabsContent>

            <TabsContent value="categories" className="space-y-4 mt-4">
              <CategoryList 
                categories={categories} 
                onAddCategory={handleAddCategory} 
                onDeleteCategory={handleDeleteCategory} 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Management;
