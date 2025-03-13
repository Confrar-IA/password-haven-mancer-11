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
import CategoryList from './CategoryList';
import AppSidebar from './AppSidebar';
import UserManager from './UserManager';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [newPassword, setNewPassword] = useState<Omit<Password, 'id'>>({
    title: '',
    username: '',
    password: '',
    url: '',
    category: '',
    groupId: ''
  });

  // Load data from localStorage and initialize admin user if needed
  useEffect(() => {
    console.log("PasswordVault - Initializing with user:", initialUser);
    loadFromLocalStorage();
    
    if (initialUser) {
      setCurrentUser(initialUser);
    }
  }, [initialUser]);

  // Ensure we save to localStorage after initial render
  useEffect(() => {
    // Force run the createAdminUserIfNoneExists function on mount
    setTimeout(() => {
      createAdminUserIfNoneExists();
    }, 100);
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

  const createAdminUserIfNoneExists = () => {
    console.log("Checking for admin user...", users);
    
    // Check if admin user exists
    const adminExists = users.some(user => user.username === 'admin');
    
    if (!adminExists) {
      console.log("Creating admin user");
      const adminUser: User = {
        id: 'admin-' + Date.now().toString(),
        username: 'admin',
        password: 'admin',
        fullName: 'Administrador',
        role: 'admin',
        groups: []
      };
      
      // Update state
      const updatedUsers = [...users, adminUser];
      setUsers(updatedUsers);
      
      // Save directly to localStorage
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      toast({
        title: "Usuário Administrador Criado",
        description: "Um usuário administrador foi criado automaticamente (admin/admin)",
      });
    } else {
      console.log("Admin user already exists");
    }
  };

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
      try {
        const parsedUsers = JSON.parse(storedUsers);
        setUsers(parsedUsers);
        console.log("Loaded users from localStorage:", parsedUsers);
      } catch (error) {
        console.error("Error parsing users from localStorage:", error);
        setUsers([]);
      }
    } else {
      console.log("No users found in localStorage");
      setUsers([]);
    }
    
    // Call createAdminUserIfNoneExists after setting users
    setTimeout(() => {
      createAdminUserIfNoneExists();
    }, 100);
  };

  const handleAddPassword = () => {
    if (!newPassword.title || !newPassword.username || !newPassword.password) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const passwordEntry: Password = {
      id: Date.now().toString(),
      ...newPassword
    };

    const updatedPasswords = [...passwords, passwordEntry];
    setPasswords(updatedPasswords);
    
    // Save directly to localStorage
    localStorage.setItem('passwords', JSON.stringify(updatedPasswords));
    
    setNewPassword({ title: '', username: '', password: '', url: '', category: '', groupId: '' });
    toast({
      title: "Sucesso",
      description: "Senha adicionada com sucesso"
    });
  };

  const handleDeletePassword = (id: string) => {
    const updatedPasswords = passwords.filter(password => password.id !== id);
    setPasswords(updatedPasswords);
    
    // Save directly to localStorage
    localStorage.setItem('passwords', JSON.stringify(updatedPasswords));
    
    toast({
      title: "Sucesso",
      description: "Senha removida com sucesso"
    });
  };

  const handleAddCategory = (category: PasswordCategory) => {
    const updatedCategories = [...categories, category];
    setCategories(updatedCategories);
    
    // Save directly to localStorage
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
    
    toast({
      title: "Sucesso",
      description: "Categoria adicionada com sucesso"
    });
  };

  const handleDeleteCategory = (id: string) => {
    // Check if any passwords are using this category
    const passwordsWithCategory = passwords.filter(password => password.category === id);
    if (passwordsWithCategory.length > 0) {
      toast({
        title: "Erro",
        description: `Não é possível excluir: ${passwordsWithCategory.length} senhas usam esta categoria`,
        variant: "destructive",
      });
      return;
    }

    const updatedCategories = categories.filter(category => category.id !== id);
    setCategories(updatedCategories);
    
    // Save directly to localStorage
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
    
    toast({
      title: "Sucesso",
      description: "Categoria removida com sucesso"
    });
  };

  const handleUserSelect = (user: User) => {
    setCurrentUser(user);
  };

  if (!currentUser) {
    return <div className="flex items-center justify-center h-screen">Carregando Usuário...</div>;
  }

  return (
    <>
      <AppSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        users={users}
        handleUserSelect={handleUserSelect}
      />
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'passwords' && (
          <>
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">Adicionar Nova Senha</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      placeholder="Título"
                      value={newPassword.title}
                      onChange={(e) => setNewPassword({ ...newPassword, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Nome de Usuário</Label>
                    <Input
                      id="username"
                      placeholder="Nome de Usuário"
                      value={newPassword.username}
                      onChange={(e) => setNewPassword({ ...newPassword, username: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Senha"
                      value={newPassword.password}
                      onChange={(e) => setNewPassword({ ...newPassword, password: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="url">URL</Label>
                    <Input
                      id="url"
                      type="url"
                      placeholder="URL"
                      value={newPassword.url}
                      onChange={(e) => setNewPassword({ ...newPassword, url: e.target.value })}
                    />
                  </div>
                  
                  <div className="mt-4 col-span-2 flex justify-end">
                    <Button onClick={handleAddPassword} className="bg-teal-700 hover:bg-teal-800">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Senha
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <PasswordList
              passwords={passwords}
              categories={categories}
              groups={groups}
              onDelete={handleDeletePassword}
            />
          </>
        )}

        {activeTab === 'categories' && (
          <CategoryList
            categories={categories}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        )}

        {activeTab === 'users' && currentUser.role === 'admin' && (
          <UserManager
            users={users}
            setUsers={setUsers}
            groups={groups}
            setGroups={setGroups}
          />
        )}
      </div>
    </>
  );
};

export default PasswordVault;
