
import React, { useState } from 'react';
import { User, PermissionGroup } from './PasswordVault';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckboxItem, CheckboxGroup } from "./CheckboxGroup";
import { Plus, UserPlus, Shield, X, Edit, Trash, Save, Eye, EyeOff } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

interface UserManagerProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  groups: PermissionGroup[];
  setGroups: React.Dispatch<React.SetStateAction<PermissionGroup[]>>;
}

const UserManager: React.FC<UserManagerProps> = ({ users, setUsers, groups, setGroups }) => {
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({
    username: '',
    fullName: '',
    role: 'user',
    groups: [],
    password: ''
  });

  const [newGroup, setNewGroup] = useState<Omit<PermissionGroup, 'id'>>({
    name: '',
    description: ''
  });

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingGroup, setEditingGroup] = useState<PermissionGroup | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleAddUser = () => {
    if (!newUser.username || !newUser.fullName || !newUser.password) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const userEntry: User = {
      id: Date.now().toString(),
      ...newUser
    };

    setUsers([...users, userEntry]);
    setNewUser({ username: '', fullName: '', role: 'user', groups: [], password: '' });
    toast({
      title: "Sucesso",
      description: "Usuário adicionado com sucesso"
    });
  };

  const handleEditUser = () => {
    if (!editingUser || !editingUser.username || !editingUser.fullName) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setUsers(users.map(user => user.id === editingUser.id ? editingUser : user));
    setEditingUser(null);
    toast({
      title: "Sucesso",
      description: "Usuário atualizado com sucesso"
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
      description: "Grupo adicionado com sucesso"
    });
  };

  const handleEditGroup = () => {
    if (!editingGroup || !editingGroup.name) {
      toast({
        title: "Erro",
        description: "Por favor, forneça um nome para o grupo",
        variant: "destructive",
      });
      return;
    }

    setGroups(groups.map(group => group.id === editingGroup.id ? editingGroup : group));
    setEditingGroup(null);
    toast({
      title: "Sucesso",
      description: "Grupo atualizado com sucesso"
    });
  };

  const handleRemoveUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: "Sucesso",
      description: "Usuário removido com sucesso"
    });
  };

  const handleRemoveGroup = (groupId: string) => {
    // Check if any users are using this group
    const usersWithGroup = users.filter(user => user.groups.includes(groupId));
    if (usersWithGroup.length > 0) {
      toast({
        title: "Erro",
        description: `Não é possível excluir: ${usersWithGroup.length} usuários pertencem a este grupo`,
        variant: "destructive",
      });
      return;
    }
    
    setGroups(groups.filter(group => group.id !== groupId));
    toast({
      title: "Sucesso",
      description: "Grupo removido com sucesso"
    });
  };

  const handleToggleGroupForUser = (userId: string, groupId: string) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        const newGroups = user.groups.includes(groupId)
          ? user.groups.filter(g => g !== groupId)
          : [...user.groups, groupId];
        
        return { ...user, groups: newGroups };
      }
      return user;
    }));
  };

  return (
    <Tabs defaultValue="users" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="users" className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Usuários
        </TabsTrigger>
        <TabsTrigger value="groups" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Grupos de Permissão
        </TabsTrigger>
      </TabsList>

      <TabsContent value="users" className="space-y-4 mt-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingUser ? "Editar Usuário" : "Adicionar Novo Usuário"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nome de Usuário</Label>
                <Input
                  id="username"
                  placeholder="Nome de Usuário"
                  value={editingUser ? editingUser.username : newUser.username}
                  onChange={(e) => editingUser 
                    ? setEditingUser({...editingUser, username: e.target.value})
                    : setNewUser({...newUser, username: e.target.value})
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Nome Completo</Label>
                <Input
                  id="fullName"
                  placeholder="Nome Completo"
                  value={editingUser ? editingUser.fullName : newUser.fullName}
                  onChange={(e) => editingUser
                    ? setEditingUser({...editingUser, fullName: e.target.value})
                    : setNewUser({...newUser, fullName: e.target.value})
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha"
                    value={editingUser ? editingUser.password || '' : newUser.password || ''}
                    onChange={(e) => editingUser
                      ? setEditingUser({...editingUser, password: e.target.value})
                      : setNewUser({...newUser, password: e.target.value})
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Função</Label>
                <Select
                  value={editingUser ? editingUser.role : newUser.role}
                  onValueChange={(value: 'admin' | 'user') => editingUser
                    ? setEditingUser({...editingUser, role: value})
                    : setNewUser({...newUser, role: value})
                  }
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Selecionar função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="user">Usuário Regular</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 col-span-2">
                <Label>Grupos de Acesso</Label>
                <div className="border rounded-md p-3 space-y-2">
                  <CheckboxGroup>
                    {groups.map(group => (
                      <CheckboxItem
                        key={group.id}
                        checked={editingUser 
                          ? editingUser.groups.includes(group.id)
                          : newUser.groups.includes(group.id)
                        }
                        onCheckedChange={(checked) => {
                          if (editingUser) {
                            if (checked) {
                              setEditingUser({
                                ...editingUser, 
                                groups: [...editingUser.groups, group.id]
                              });
                            } else {
                              setEditingUser({
                                ...editingUser, 
                                groups: editingUser.groups.filter(g => g !== group.id)
                              });
                            }
                          } else {
                            if (checked) {
                              setNewUser({...newUser, groups: [...newUser.groups, group.id]});
                            } else {
                              setNewUser({...newUser, groups: newUser.groups.filter(g => g !== group.id)});
                            }
                          }
                        }}
                      >
                        {group.name}
                      </CheckboxItem>
                    ))}
                  </CheckboxGroup>
                </div>
              </div>

              <div className="mt-4 col-span-2 flex justify-end gap-2">
                {editingUser && (
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingUser(null)}
                  >
                    Cancelar
                  </Button>
                )}
                <Button 
                  onClick={editingUser ? handleEditUser : handleAddUser}
                  className="bg-teal-700 hover:bg-teal-800"
                >
                  {editingUser ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Atualizar Usuário
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Usuário
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map(user => (
            <Card key={user.id} className="relative overflow-hidden">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg">{user.fullName}</h3>
                <p className="text-sm text-gray-500">@{user.username}</p>
                <Badge className="mt-1" variant={user.role === 'admin' ? 'default' : 'outline'}>
                  {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                </Badge>
                
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Senha: {user.password || 'Não definida'}</p>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Grupos de Acesso:</h4>
                  <div className="flex flex-wrap gap-2">
                    {groups.map(group => (
                      <Badge 
                        key={group.id} 
                        variant={user.groups.includes(group.id) ? 'default' : 'outline'}
                        className="cursor-pointer hover:opacity-80"
                        onClick={() => handleToggleGroupForUser(user.id, group.id)}
                      >
                        {group.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setEditingUser(user)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleRemoveUser(user.id)}
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="groups" className="space-y-4 mt-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingGroup ? "Editar Grupo de Permissão" : "Adicionar Novo Grupo de Permissão"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="groupName">Nome do Grupo</Label>
                <Input
                  id="groupName"
                  placeholder="Nome do Grupo"
                  value={editingGroup ? editingGroup.name : newGroup.name}
                  onChange={(e) => editingGroup
                    ? setEditingGroup({...editingGroup, name: e.target.value})
                    : setNewGroup({...newGroup, name: e.target.value})
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="groupDescription">Descrição</Label>
                <Input
                  id="groupDescription"
                  placeholder="Descrição"
                  value={editingGroup ? editingGroup.description : newGroup.description}
                  onChange={(e) => editingGroup
                    ? setEditingGroup({...editingGroup, description: e.target.value})
                    : setNewGroup({...newGroup, description: e.target.value})
                  }
                />
              </div>

              <div className="mt-4 col-span-2 flex justify-end gap-2">
                {editingGroup && (
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingGroup(null)}
                  >
                    Cancelar
                  </Button>
                )}
                <Button 
                  onClick={editingGroup ? handleEditGroup : handleAddGroup} 
                  className="bg-teal-700 hover:bg-teal-800"
                >
                  {editingGroup ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Atualizar Grupo
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Grupo
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map(group => (
            <Card key={group.id} className="relative overflow-hidden">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg">{group.name}</h3>
                <p className="text-sm text-gray-500">{group.description}</p>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Usuários com acesso:</h4>
                  <div className="flex flex-wrap gap-2">
                    {users
                      .filter(user => user.groups.includes(group.id))
                      .map(user => (
                        <Badge key={user.id}>
                          {user.fullName}
                        </Badge>
                      ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setEditingGroup(group)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleRemoveGroup(group.id)}
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default UserManager;
