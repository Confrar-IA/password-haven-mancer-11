// Update the User interface to include password
export interface User {
  id: string;
  username: string;
  fullName: string;
  role: 'admin' | 'user';
  groups: string[];
  password?: string;
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

import React, { useState, useEffect } from 'react';
import PasswordList from './PasswordList';
import AppSidebar from './AppSidebar';
import Management from '../pages/Management';
import Settings from '../pages/Settings';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Plus, Edit } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

interface PasswordVaultProps {
  initialUser?: User;
}

const PasswordVault: React.FC<PasswordVaultProps> = ({ initialUser }) => {
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [categories, setCategories] = useState<PasswordCategory[]>([]);
  const [groups, setGroups] = useState<PermissionGroup[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState('passwords');
  const [passwordTab, setPasswordTab] = useState('list');
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'default',
    username: 'default',
    fullName: 'Default User',
    role: 'user',
    groups: [],
  });

  const [newPassword, setNewPassword] = useState<Omit<Password, 'id'>>({
    title: '',
    username: '',
    password: '',
    url: '',
    category: '',
    groupId: ''
  });

  const [editingPassword, setEditingPassword] = useState<Password | null>(null);

  const handleUserSelect = (user: User) => {
    setCurrentUser(user);
    toast({
      title: "Usuário alterado",
      description: `Agora visualizando como: ${user.fullName}`
    });
  };

  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  useEffect(() => {
    localStorage.setItem('passwords', JSON.stringify(passwords));
  }, [passwords]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const loadFromLocalStorage = () => {
    const storedPasswords = localStorage.getItem('passwords');
    if (storedPasswords) {
      setPasswords(JSON.parse(storedPasswords));
    }

    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    }

    const storedGroups = localStorage.getItem('groups');
    if (storedGroups) {
      setGroups(JSON.parse(storedGroups));
    }

    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }

    if (initialUser) {
      setCurrentUser(initialUser);
    }
  };

  const handleAddPassword = () => {
    if (!newPassword.title || !newPassword.username || !newPassword.password || !newPassword.category || !newPassword.groupId) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios, incluindo Categoria e Grupo",
        variant: "destructive",
      });
      return;
    }

    const passwordEntry: Password = {
      id: Date.now().toString(),
      ...newPassword
    };

    setPasswords([...passwords, passwordEntry]);
    setNewPassword({ title: '', username: '', password: '', url: '', category: '', groupId: '' });
    toast({
      title: "Sucesso",
      description: "Senha adicionada com sucesso"
    });
    
    setPasswordTab('list');
  };

  const handleEditPassword = () => {
    if (!editingPassword || !editingPassword.title || !editingPassword.username || !editingPassword.password || !editingPassword.category || !editingPassword.groupId) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios, incluindo Categoria e Grupo",
        variant: "destructive",
      });
      return;
    }

    setPasswords(passwords.map(pwd => pwd.id === editingPassword.id ? editingPassword : pwd));
    setEditingPassword(null);
    toast({
      title: "Sucesso",
      description: "Senha atualizada com sucesso"
    });
    
    setPasswordTab('list');
  };

  const handleDeletePassword = (id: string) => {
    setPasswords(passwords.filter(password => password.id !== id));
    toast({
      title: "Sucesso",
      description: "Senha removida com sucesso"
    });
  };

  const handleEditPasswordClick = (password: Password) => {
    setEditingPassword(password);
    setPasswordTab('edit');
  };

  const PasswordForm = ({ isEditing = false }: { isEditing?: boolean }) => {
    const passwordData = isEditing ? editingPassword : newPassword;
    const setPasswordData = isEditing 
      ? (data: any) => setEditingPassword({ ...editingPassword, ...data }) 
      : (data: any) => setNewPassword({ ...newPassword, ...data });

    if (!passwordData) return null;

    return (
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-2xl font-semibold mb-4">
            {isEditing ? "Editar Senha" : "Adicionar Nova Senha"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                placeholder="Título"
                value={passwordData.title}
                onChange={(e) => setPasswordData({ title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Nome de Usuário</Label>
              <Input
                id="username"
                placeholder="Nome de Usuário"
                value={passwordData.username}
                onChange={(e) => setPasswordData({ username: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Senha"
                value={passwordData.password}
                onChange={(e) => setPasswordData({ password: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="URL"
                value={passwordData.url}
                onChange={(e) => setPasswordData({ url: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={passwordData.category}
                onValueChange={(value) => setPasswordData({ category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selecionar categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="group">Grupo</Label>
              <Select
                value={passwordData.groupId}
                onValueChange={(value) => setPasswordData({ groupId: value })}
              >
                <SelectTrigger id="group">
                  <SelectValue placeholder="Selecionar grupo" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map(group => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="mt-4 col-span-2 flex justify-end">
              {isEditing && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEditingPassword(null);
                    setPasswordTab('list');
                  }}
                  className="mr-2"
                >
                  Cancelar
                </Button>
              )}
              <Button 
                onClick={isEditing ? handleEditPassword : handleAddPassword} 
                className="bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700"
              >
                {isEditing ? (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Atualizar Senha
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Senha
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <AppSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        users={users}
        handleUserSelect={handleUserSelect}
      />
      <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        {activeTab === 'passwords' && (
          <div className="space-y-6">
            <Tabs value={passwordTab} onValueChange={setPasswordTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="list">Visualizar Senhas</TabsTrigger>
                <TabsTrigger value="add">Adicionar Senha</TabsTrigger>
              </TabsList>
              
              <TabsContent value="add">
                <PasswordForm />
              </TabsContent>
              
              <TabsContent value="edit">
                <PasswordForm isEditing={true} />
              </TabsContent>
              
              <TabsContent value="list">
                <PasswordList
                  passwords={passwords}
                  categories={categories}
                  groups={groups}
                  onDelete={handleDeletePassword}
                  onEdit={handleEditPasswordClick}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}

        {activeTab === 'management' && (
          <Management 
            users={users} 
            setUsers={setUsers} 
            groups={groups} 
            setGroups={setGroups} 
            categories={categories} 
            setCategories={setCategories} 
          />
        )}
        
        {activeTab === 'settings' && (
          <Settings />
        )}
      </div>
    </>
  );
};

export default PasswordVault;
