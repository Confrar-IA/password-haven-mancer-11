
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManager from '../components/UserManager';
import CategoryList from '../components/CategoryList';
import { Card, CardContent } from "@/components/ui/card";
import { User, PermissionGroup, PasswordCategory } from '../components/PasswordVault';
import { UserPlus, Shield, Tag } from 'lucide-react';

interface ManagementProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  groups: PermissionGroup[];
  setGroups: React.Dispatch<React.SetStateAction<PermissionGroup[]>>;
  categories: PasswordCategory[];
  setCategories: React.Dispatch<React.SetStateAction<PasswordCategory[]>>;
}

const Management: React.FC<ManagementProps> = ({ 
  users, 
  setUsers, 
  groups, 
  setGroups, 
  categories, 
  setCategories 
}) => {
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
              <UserManager users={users} setUsers={setUsers} groups={groups} setGroups={setGroups} />
            </TabsContent>

            <TabsContent value="groups" className="space-y-4 mt-4">
              <UserManager users={users} setUsers={setUsers} groups={groups} setGroups={setGroups} initialTab="groups" />
            </TabsContent>

            <TabsContent value="categories" className="space-y-4 mt-4">
              <CategoryList 
                categories={categories} 
                onAddCategory={(category) => setCategories([...categories, category])} 
                onDeleteCategory={(id) => setCategories(categories.filter(c => c.id !== id))} 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Management;
