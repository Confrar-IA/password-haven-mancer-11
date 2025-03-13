
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

export interface LogEntry {
  id: string;
  timestamp: number;
  action: 'login' | 'logout' | 'create' | 'update' | 'delete';
  entityType: 'password' | 'user' | 'category' | 'group';
  entityId: string;
  description: string;
  userId: string;
}

import React, { useState, useEffect, useCallback } from 'react';
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
import { Plus, Edit, Search } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

interface PasswordVaultProps {
  initialUser?: User;
}

const PasswordVault: React.FC<PasswordVaultProps> = ({ initialUser }) => {
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [filteredPasswords, setFilteredPasswords] = useState<Password[]>([]);
  const [categories, setCategories] = useState<PasswordCategory[]>([]);
  const [groups, setGroups] = useState<PermissionGroup[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeTab, setActiveTab] = useState('passwords');
  const [passwordTab, setPasswordTab] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [searchGroup, setSearchGroup] = useState('');
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

  // Log action function
  const logAction = useCallback((action: LogEntry['action'], entityType: LogEntry['entityType'], entityId: string, description: string) => {
    const logEntry: LogEntry = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      action,
      entityType,
      entityId,
      description,
      userId: currentUser.id
    };
    
    setLogs(prevLogs => {
      const newLogs = [...prevLogs, logEntry];
      localStorage.setItem('logs', JSON.stringify(newLogs));
      return newLogs;
    });
  }, [currentUser.id]);

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

  useEffect(() => {
    localStorage.setItem('logs', JSON.stringify(logs));
  }, [logs]);

  // Apply filtering whenever search parameters or passwords change
  useEffect(() => {
    let results = [...passwords];
    
    if (searchTerm) {
      const lowercaseTerm = searchTerm.toLowerCase();
      results = results.filter(password => 
        password.title.toLowerCase().includes(lowercaseTerm) || 
        password.username.toLowerCase().includes(lowercaseTerm) || 
        (password.url && password.url.toLowerCase().includes(lowercaseTerm))
      );
    }
    
    if (searchCategory) {
      results = results.filter(password => password.category === searchCategory);
    }
    
    if (searchGroup) {
      results = results.filter(password => password.groupId === searchGroup);
    }
    
    setFilteredPasswords(results);
  }, [passwords, searchTerm, searchCategory, searchGroup]);

  const loadFromLocalStorage = () => {
    const storedPasswords = localStorage.getItem('passwords');
    if (storedPasswords) {
      const parsedPasswords = JSON.parse(storedPasswords);
      setPasswords(parsedPasswords);
      setFilteredPasswords(parsedPasswords);
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

    const storedLogs = localStorage.getItem('logs');
    if (storedLogs) {
      setLogs(JSON.parse(storedLogs));
    }

    if (initialUser) {
      setCurrentUser(initialUser);
      
      // Log login action
      setTimeout(() => {
        const logEntry: LogEntry = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          action: 'login',
          entityType: 'user',
          entityId: initialUser.id,
          description: `Login: ${initialUser.username}`,
          userId: initialUser.id
        };
        
        setLogs(prevLogs => {
          const newLogs = [...prevLogs, logEntry];
          localStorage.setItem('logs', JSON.stringify(newLogs));
          return newLogs;
        });
      }, 500);
    }
  };

  // Using useCallback to ensure stability of the function
  const handleAddPassword = useCallback(() => {
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

    setPasswords(prev => [...prev, passwordEntry]);
    
    // Log password creation
    logAction('create', 'password', passwordEntry.id, `Nova senha criada: ${passwordEntry.title}`);
    
    setNewPassword({ title: '', username: '', password: '', url: '', category: '', groupId: '' });
    toast({
      title: "Sucesso",
      description: "Senha adicionada com sucesso"
    });
    
    setPasswordTab('list');
  }, [newPassword, logAction]);

  // Using useCallback for handleEditPassword as well
  const handleEditPassword = useCallback(() => {
    if (!editingPassword || !editingPassword.title || !editingPassword.username || !editingPassword.password || !editingPassword.category || !editingPassword.groupId) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios, incluindo Categoria e Grupo",
        variant: "destructive",
      });
      return;
    }

    setPasswords(passwords.map(pwd => pwd.id === editingPassword.id ? editingPassword : pwd));
    
    // Log password update
    logAction('update', 'password', editingPassword.id, `Senha atualizada: ${editingPassword.title}`);
    
    setEditingPassword(null);
    toast({
      title: "Sucesso",
      description: "Senha atualizada com sucesso"
    });
    
    setPasswordTab('list');
  }, [editingPassword, passwords, logAction]);

  const handleDeletePassword = useCallback((id: string) => {
    const passwordToDelete = passwords.find(p => p.id === id);
    setPasswords(passwords.filter(password => password.id !== id));
    
    // Log password deletion
    if (passwordToDelete) {
      logAction('delete', 'password', id, `Senha excluída: ${passwordToDelete.title}`);
    }
    
    toast({
      title: "Sucesso",
      description: "Senha removida com sucesso"
    });
  }, [passwords, logAction]);

  const handleEditPasswordClick = (password: Password) => {
    setEditingPassword(password);
    setPasswordTab('edit');
  };

  // Clear all search filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setSearchCategory('');
    setSearchGroup('');
  };

  // Create memoized callbacks for form inputs to prevent focus loss
  const handleNewPasswordChange = useCallback((field: keyof Omit<Password, 'id'>, value: string) => {
    setNewPassword(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleEditingPasswordChange = useCallback((field: keyof Password, value: string) => {
    if (editingPassword) {
      setEditingPassword(prev => prev ? { ...prev, [field]: value } : null);
    }
  }, [editingPassword]);

  const PasswordForm = ({ isEditing = false }: { isEditing?: boolean }) => {
    const passwordData = isEditing ? editingPassword : newPassword;
    
    // Use the memoized callbacks based on whether we're editing or creating
    const handleChange = isEditing 
      ? handleEditingPasswordChange
      : handleNewPasswordChange;

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
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Nome de Usuário</Label>
              <Input
                id="username"
                placeholder="Nome de Usuário"
                value={passwordData.username}
                onChange={(e) => handleChange('username', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Senha"
                value={passwordData.password}
                onChange={(e) => handleChange('password', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="URL"
                value={passwordData.url}
                onChange={(e) => handleChange('url', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={passwordData.category}
                onValueChange={(value) => handleChange('category', value)}
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
                onValueChange={(value) => handleChange('groupId', value)}
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

  // Search filter component
  const SearchFilters = () => (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="searchTerm">Buscar</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="searchTerm"
                className="pl-9"
                placeholder="Buscar por título, usuário ou URL"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="searchCategory">Categoria</Label>
            <Select
              value={searchCategory}
              onValueChange={setSearchCategory}
            >
              <SelectTrigger id="searchCategory">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="all-categories" value="all-categories">Todas as categorias</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="searchGroup">Grupo</Label>
            <Select
              value={searchGroup}
              onValueChange={setSearchGroup}
            >
              <SelectTrigger id="searchGroup">
                <SelectValue placeholder="Todos os grupos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="all-groups" value="all-groups">Todos os grupos</SelectItem>
                {groups.map(group => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="md:col-span-4 flex justify-end">
            <Button 
              variant="outline" 
              onClick={handleClearFilters}
              className="mt-2"
            >
              Limpar Filtros
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <AppSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        users={users}
        handleUserSelect={handleUserSelect}
      />
      <div className="flex-1 overflow-y-auto p-6 bg-background text-foreground">
        {activeTab === 'passwords' && (
          <div className="space-y-6">
            <Tabs value={passwordTab} onValueChange={setPasswordTab} className="w-full">
              <TabsList className={`grid w-full ${currentUser.role === 'admin' ? 'grid-cols-2' : 'grid-cols-1'} mb-6`}>
                <TabsTrigger value="list">Visualizar Senhas</TabsTrigger>
                {currentUser.role === 'admin' && (
                  <TabsTrigger value="add">Adicionar Senha</TabsTrigger>
                )}
              </TabsList>
              
              {currentUser.role === 'admin' && (
                <TabsContent value="add">
                  <PasswordForm />
                </TabsContent>
              )}
              
              {currentUser.role === 'admin' && (
                <TabsContent value="edit">
                  <PasswordForm isEditing={true} />
                </TabsContent>
              )}
              
              <TabsContent value="list">
                <SearchFilters />
                <PasswordList
                  passwords={filteredPasswords}
                  categories={categories}
                  groups={groups}
                  onDelete={handleDeletePassword}
                  onEdit={handleEditPasswordClick}
                  userRole={currentUser.role}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}

        {activeTab === 'management' && currentUser.role === 'admin' && (
          <Management 
            users={users} 
            setUsers={setUsers} 
            groups={groups} 
            setGroups={setGroups} 
            categories={categories} 
            setCategories={setCategories} 
            logs={logs}
            logAction={logAction}
          />
        )}
        
        {activeTab === 'logs' && currentUser.role === 'admin' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Logs do Sistema</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted/50 border-b">
                        <th className="p-2 text-left">Data/Hora</th>
                        <th className="p-2 text-left">Usuário</th>
                        <th className="p-2 text-left">Ação</th>
                        <th className="p-2 text-left">Descrição</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-muted-foreground">
                            Nenhum log encontrado
                          </td>
                        </tr>
                      ) : (
                        logs
                          .sort((a, b) => b.timestamp - a.timestamp)
                          .map(log => {
                            const user = users.find(u => u.id === log.userId) || { fullName: 'Sistema', username: 'system' };
                            
                            return (
                              <tr key={log.id} className="border-b hover:bg-muted/50">
                                <td className="p-2">
                                  {new Date(log.timestamp).toLocaleString('pt-BR')}
                                </td>
                                <td className="p-2">{user.fullName}</td>
                                <td className="p-2">
                                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                                    log.action === 'login' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                    log.action === 'logout' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                    log.action === 'create' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                    log.action === 'update' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                  }`}>
                                    {log.action === 'login' ? 'Login' :
                                     log.action === 'logout' ? 'Logout' :
                                     log.action === 'create' ? 'Criação' :
                                     log.action === 'update' ? 'Atualização' :
                                     'Exclusão'}
                                  </span>
                                </td>
                                <td className="p-2">{log.description}</td>
                              </tr>
                            );
                          })
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <Settings />
        )}
      </div>
    </>
  );
};

export default PasswordVault;
