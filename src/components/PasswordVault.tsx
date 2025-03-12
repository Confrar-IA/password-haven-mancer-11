import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PasswordList from './PasswordList';
import PasswordGenerator from './PasswordGenerator';
import UserManager from './UserManager';
import { Eye, EyeOff, Search, Plus, Users, Lock, Filter, Bell, Tag, Check, Link } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { CheckboxGroup, CheckboxItem } from './CheckboxGroup';
import { Badge } from "@/components/ui/badge";
import AppSidebar from './AppSidebar';
import Login from './Login';

export type User = {
  id: string;
  username: string;
  fullName: string;
  role: 'admin' | 'user';
  groups: string[];
  password?: string;
};

export type PasswordCategory = {
  id: string;
  name: string;
  groupId: string;
};

export type PermissionGroup = {
  id: string;
  name: string;
  description: string;
};

export type Password = {
  id: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  category: string;
  groupId: string;
};

const INITIAL_GROUPS: PermissionGroup[] = [
  { id: '1', name: 'Pessoal', description: 'Senhas pessoais' },
  { id: '2', name: 'Trabalho', description: 'Senhas relacionadas ao trabalho' },
  { id: '3', name: 'Finanças', description: 'Contas financeiras' },
];

const INITIAL_CATEGORIES: PasswordCategory[] = [
  { id: '1', name: 'Redes Sociais', groupId: '1' },
  { id: '2', name: 'Email', groupId: '1' },
  { id: '3', name: 'Bancos', groupId: '3' },
  { id: '4', name: 'Ferramentas de Trabalho', groupId: '2' },
];

const INITIAL_USERS: User[] = [
  { id: '1', username: 'admin', fullName: 'Administrador', role: 'admin', groups: ['1', '2', '3'], password: 'admin123' },
  { id: '2', username: 'usuario1', fullName: 'Usuário Regular', role: 'user', groups: ['1'], password: 'user123' },
];

const LOCAL_STORAGE_KEYS = {
  PASSWORDS: 'password_vault_passwords',
  USERS: 'password_vault_users',
  GROUPS: 'password_vault_groups',
  CATEGORIES: 'password_vault_categories',
  CURRENT_USER: 'password_vault_current_user',
  IS_LOGGED_IN: 'password_vault_is_logged_in'
};

const PasswordVault = () => {
  // State declarations
  const [activeTab, setActiveTab] = useState("passwords");
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [groups, setGroups] = useState<PermissionGroup[]>(INITIAL_GROUPS);
  const [categories, setCategories] = useState<PasswordCategory[]>(INITIAL_CATEGORIES);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCategoryFilters, setShowCategoryFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [newPassword, setNewPassword] = useState({
    title: '',
    username: '',
    password: '',
    url: '',
    category: '',
    groupId: ''
  });

  const [newCategory, setNewCategory] = useState({
    name: '',
    groupId: ''
  });

  const [newGroup, setNewGroup] = useState({
    name: '',
    description: ''
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedPasswords = localStorage.getItem(LOCAL_STORAGE_KEYS.PASSWORDS);
    if (savedPasswords) setPasswords(JSON.parse(savedPasswords));
    
    const savedUsers = localStorage.getItem(LOCAL_STORAGE_KEYS.USERS);
    if (savedUsers) setUsers(JSON.parse(savedUsers));
    else localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    
    const savedGroups = localStorage.getItem(LOCAL_STORAGE_KEYS.GROUPS);
    if (savedGroups) setGroups(JSON.parse(savedGroups));
    else localStorage.setItem(LOCAL_STORAGE_KEYS.GROUPS, JSON.stringify(INITIAL_GROUPS));
    
    const savedCategories = localStorage.getItem(LOCAL_STORAGE_KEYS.CATEGORIES);
    if (savedCategories) setCategories(JSON.parse(savedCategories));
    else localStorage.setItem(LOCAL_STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    
    const savedIsLoggedIn = localStorage.getItem(LOCAL_STORAGE_KEYS.IS_LOGGED_IN);
    if (savedIsLoggedIn === 'true') {
      const savedCurrentUser = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
      if (savedCurrentUser) {
        setCurrentUser(JSON.parse(savedCurrentUser));
        setIsLoggedIn(true);
      }
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    if (passwords && passwords.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.PASSWORDS, JSON.stringify(passwords));
    }
  }, [passwords]);

  useEffect(() => {
    if (users && users.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(users));
    }
  }, [users]);

  useEffect(() => {
    if (groups && groups.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.GROUPS, JSON.stringify(groups));
    }
  }, [groups]);

  useEffect(() => {
    if (categories && categories.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    }
  }, [categories]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
      localStorage.setItem(LOCAL_STORAGE_KEYS.IS_LOGGED_IN, 'true');
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
      localStorage.setItem(LOCAL_STORAGE_KEYS.IS_LOGGED_IN, 'false');
    }
  }, [currentUser]);

  const handleAddPassword = () => {
    if (!newPassword.title || !newPassword.password || !newPassword.groupId) {
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

    setPasswords([...passwords, passwordEntry]);
    setNewPassword({ title: '', username: '', password: '', url: '', category: '', groupId: '' });
    setShowAddForm(false);
    toast({
      title: "Sucesso",
      description: "Senha adicionada com sucesso",
    });
  };

  const handleDeletePassword = (id: string) => {
    setPasswords(passwords.filter(password => password.id !== id));
    toast({
      title: "Sucesso",
      description: "Senha excluída com sucesso",
    });
  };

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.groupId) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const categoryEntry: PasswordCategory = {
      id: Date.now().toString(),
      ...newCategory
    };

    setCategories([...categories, categoryEntry]);
    setNewCategory({ name: '', groupId: '' });
    toast({
      title: "Sucesso",
      description: "Categoria adicionada com sucesso",
    });
  };
  
  const handleDeleteCategory = (id: string) => {
    // Check if any passwords are using this category
    const passwordsUsingCategory = passwords.filter(pw => pw.category === id);
    if (passwordsUsingCategory.length > 0) {
      toast({
        title: "Erro",
        description: `Não é possível excluir: ${passwordsUsingCategory.length} senhas usam esta categoria`,
        variant: "destructive",
      });
      return;
    }
    
    setCategories(categories.filter(cat => cat.id !== id));
    setSelectedCategories(selectedCategories.filter(catId => catId !== id));
    toast({
      title: "Sucesso",
      description: "Categoria excluída com sucesso",
    });
  };

  const handleEditCategory = (category: PasswordCategory) => {
    setCategories(categories.map(cat => 
      cat.id === category.id ? category : cat
    ));
    toast({
      title: "Sucesso",
      description: "Categoria editada com sucesso",
    });
  };

  const handleAddGroup = () => {
    if (!newGroup.name) {
      toast({
        title: "Erro",
        description: "Por favor, forneça um nome para o grupo",
        variant: "destructive",
      });
      return;
    }

    const groupEntry: PermissionGroup = {
      id: Date.now().toString(),
      ...newGroup
    };

    setGroups([...groups, groupEntry]);
    setNewGroup({ name: '', description: '' });
    toast({
      title: "Sucesso",
      description: "Grupo de permissão adicionado com sucesso",
    });
  };

  const handleUserSelect = (user: User) => {
    setCurrentUser(user);
    toast({
      title: "Usuário Alterado",
      description: `Agora visualizando como ${user.fullName}`,
    });
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setActiveTab("passwords");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    toast({
      title: "Logout",
      description: "Você saiu do sistema com sucesso",
    });
  };

  const toggleCategoryFilter = (categoryId: string) => {
    setSelectedCategories(prevSelected => {
      if (prevSelected.includes(categoryId)) {
        return prevSelected.filter(id => id !== categoryId);
      } else {
        return [...prevSelected, categoryId];
      }
    });
  };

  // Se não estiver logado, mostrar tela de login
  if (!isLoggedIn || !currentUser) {
    return <Login users={users} onLogin={handleLogin} />;
  }

  // Editing state for categories
  const [editingCategory, setEditingCategory] = useState<PasswordCategory | null>(null);

  // Somente mostrar grupos que o usuário atual tem acesso
  const userGroups = groups.filter(group => 
    currentUser.role === 'admin' || currentUser.groups.includes(group.id)
  );

  // Somente mostrar categorias nos grupos que o usuário tem acesso
  const userCategories = categories.filter(category => 
    currentUser.role === 'admin' || currentUser.groups.includes(category.groupId)
  );

  // Filtrar senhas com base na pesquisa, categorias selecionadas e permissões do usuário
  const filteredPasswords = passwords.filter(
    pass => (currentUser.role === 'admin' || currentUser.groups.includes(pass.groupId)) &&
            (pass.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             pass.username.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (selectedCategories.length === 0 || selectedCategories.includes(pass.category))
  );

  return (
    <div className="min-h-screen bg-teal-900 flex">
      <AppSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentUser={currentUser} 
        users={users} 
        handleUserSelect={handleUserSelect}
        onLogout={handleLogout}
      />
      
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <Card className="p-6 backdrop-blur-sm bg-white/95 shadow-lg border-0">
            <div className="flex flex-col space-y-4">
              {activeTab === "passwords" && (
                <div className="mt-4 space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <Input
                        placeholder="Pesquisar senhas..."
                        className="pl-10 border-gray-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setShowCategoryFilters(!showCategoryFilters)}
                        variant="outline"
                        className="gap-2 border-gray-200"
                      >
                        <Filter className="h-5 w-5" />
                        Filtrar
                      </Button>
                      {currentUser.role === 'admin' && (
                        <Button
                          onClick={() => setShowAddForm(!showAddForm)}
                          className="gap-2 bg-teal-700 hover:bg-teal-800"
                        >
                          <Plus className="h-5 w-5" />
                          Adicionar Senha
                        </Button>
                      )}
                    </div>
                  </div>

                  {showCategoryFilters && (
                    <Card className="p-4 animate-fade-in border-gray-200">
                      <div className="flex flex-wrap gap-4">
                        <CheckboxGroup label="Filtrar por categoria:" className="flex-1">
                          {userCategories.map(category => (
                            <CheckboxItem 
                              key={category.id}
                              checked={selectedCategories.includes(category.id)}
                              onCheckedChange={() => toggleCategoryFilter(category.id)}
                              value={category.id}
                            >
                              {category.name}
                            </CheckboxItem>
                          ))}
                        </CheckboxGroup>
                        {selectedCategories.length > 0 && (
                          <div className="flex flex-col justify-end mb-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setSelectedCategories([])}
                              className="text-sm text-teal-700"
                            >
                              Limpar filtros
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}

                  {showAddForm && currentUser.role === 'admin' && (
                    <Card className="p-4 animate-fade-in border-gray-200">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-teal-900">Nova Senha</h3>
                        <Input
                          placeholder="Título"
                          value={newPassword.title}
                          onChange={(e) => setNewPassword({...newPassword, title: e.target.value})}
                          className="border-gray-200"
                        />
                        <Input
                          placeholder="Nome de usuário"
                          value={newPassword.username}
                          onChange={(e) => setNewPassword({...newPassword, username: e.target.value})}
                          className="border-gray-200"
                        />
                        <div className="flex gap-4">
                          <Input
                            placeholder="Senha"
                            type="password"
                            value={newPassword.password}
                            onChange={(e) => setNewPassword({...newPassword, password: e.target.value})}
                            className="border-gray-200"
                          />
                          <PasswordGenerator onGenerate={(pwd) => setNewPassword({...newPassword, password: pwd})} />
                        </div>
                        
                        <div className="flex gap-4 items-center">
                          <div className="relative flex-1">
                            <Link className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <Input
                              placeholder="URL (opcional)"
                              value={newPassword.url}
                              onChange={(e) => setNewPassword({...newPassword, url: e.target.value})}
                              className="pl-10 border-gray-200"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Select 
                              value={newPassword.groupId} 
                              onValueChange={(value) => setNewPassword({...newPassword, groupId: value})}
                            >
                              <SelectTrigger className="border-gray-200">
                                <SelectValue placeholder="Selecione o grupo" />
                              </SelectTrigger>
                              <SelectContent>
                                {userGroups.map(group => (
                                  <SelectItem key={group.id} value={group.id}>
                                    {group.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Select 
                              value={newPassword.category} 
                              onValueChange={(value) => setNewPassword({...newPassword, category: value})}
                            >
                              <SelectTrigger className="border-gray-200">
                                <SelectValue placeholder="Selecione a categoria" />
                              </SelectTrigger>
                              <SelectContent>
                                {userCategories.map(category => (
                                  <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowAddForm(false)} className="border-gray-200">Cancelar</Button>
                          <Button onClick={handleAddPassword} className="bg-teal-700 hover:bg-teal-800">Salvar</Button>
                        </div>
                      </div>
                    </Card>
                  )}

                  <PasswordList 
                    passwords={filteredPasswords} 
                    categories={categories}
                    groups={groups}
                    onDelete={handleDeletePassword}
                  />
                </div>
              )}

              {activeTab === "categories" && (
                <div className="mt-4 space-y-4">
                  <div className="grid gap-4">
                    {currentUser.role === 'admin' && (
                      <Card className="p-4 border-gray-200">
                        <h3 className="text-lg font-semibold mb-4 text-teal-900">
                          {editingCategory ? "Editar Categoria" : "Adicionar Nova Categoria"}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            placeholder="Nome da Categoria"
                            value={editingCategory ? editingCategory.name : newCategory.name}
                            onChange={(e) => editingCategory 
                              ? setEditingCategory({...editingCategory, name: e.target.value})
                              : setNewCategory({...newCategory, name: e.target.value})
                            }
                            className="border-gray-200"
                          />
                          <Select 
                            value={editingCategory ? editingCategory.groupId : newCategory.groupId} 
                            onValueChange={(value) => editingCategory
                              ? setEditingCategory({...editingCategory, groupId: value})
                              : setNewCategory({...newCategory, groupId: value})
                            }
                          >
                            <SelectTrigger className="border-gray-200">
                              <SelectValue placeholder="Selecione o grupo" />
                            </SelectTrigger>
                            <SelectContent>
                              {userGroups.map(group => (
                                <SelectItem key={group.id} value={group.id}>
                                  {group.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="col-span-1 md:col-span-2 flex gap-2 justify-end">
                            {editingCategory && (
                              <Button 
                                variant="outline" 
                                onClick={() => setEditingCategory(null)}
                                className="border-gray-200"
                              >
                                Cancelar
                              </Button>
                            )}
                            <Button 
                              onClick={() => {
                                if (editingCategory) {
                                  handleEditCategory(editingCategory);
                                  setEditingCategory(null);
                                } else {
                                  handleAddCategory();
                                }
                              }} 
                              className="bg-teal-700 hover:bg-teal-800"
                            >
                              {editingCategory ? "Atualizar" : "Adicionar"} Categoria
                            </Button>
                          </div>
                        </div>
                      </Card>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {userCategories.map(category => {
                        const group = groups.find(g => g.id === category.groupId);
                        return (
                          <Card key={category.id} className="p-4 border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-teal-900">{category.name}</h3>
                                <p className="text-sm text-gray-500">Grupo: {group?.name || 'Desconhecido'}</p>
                              </div>
                              <Badge variant="outline" className="border-teal-200 text-teal-700">
                                {passwords.filter(p => p.category === category.id).length || 0} senhas
                              </Badge>
                            </div>
                            
                            {currentUser.role === 'admin' && (
                              <div className="flex justify-end gap-2 mt-3">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => setEditingCategory(category)}
                                  className="border-gray-200"
                                >
                                  Editar
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm" 
                                  onClick={() => handleDeleteCategory(category.id)}
                                >
                                  Excluir
                                </Button>
                              </div>
                            )}
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {currentUser.role === 'admin' && activeTab === "users" && (
                <div className="mt-4">
                  <UserManager 
                    users={users} 
                    setUsers={setUsers} 
                    groups={groups} 
                    setGroups={setGroups} 
                  />
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PasswordVault;
