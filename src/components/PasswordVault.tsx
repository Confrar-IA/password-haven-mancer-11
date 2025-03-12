
import React, { useState } from 'react';
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
import { Eye, EyeOff, Search, Plus, Users, Lock } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type User = {
  id: string;
  username: string;
  fullName: string;
  role: 'admin' | 'user';
  groups: string[];
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
  category: string;
  groupId: string;
};

const INITIAL_GROUPS: PermissionGroup[] = [
  { id: '1', name: 'Personal', description: 'Personal passwords' },
  { id: '2', name: 'Work', description: 'Work-related passwords' },
  { id: '3', name: 'Finance', description: 'Financial accounts' },
];

const INITIAL_CATEGORIES: PasswordCategory[] = [
  { id: '1', name: 'Social Media', groupId: '1' },
  { id: '2', name: 'Email', groupId: '1' },
  { id: '3', name: 'Banking', groupId: '3' },
  { id: '4', name: 'Work Tools', groupId: '2' },
];

const INITIAL_USERS: User[] = [
  { id: '1', username: 'admin', fullName: 'Administrator', role: 'admin', groups: ['1', '2', '3'] },
  { id: '2', username: 'user1', fullName: 'Regular User', role: 'user', groups: ['1'] },
];

const PasswordVault = () => {
  const [activeTab, setActiveTab] = useState("passwords");
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [groups, setGroups] = useState<PermissionGroup[]>(INITIAL_GROUPS);
  const [categories, setCategories] = useState<PasswordCategory[]>(INITIAL_CATEGORIES);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]); // Default to admin for demo
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPassword, setNewPassword] = useState({
    title: '',
    username: '',
    password: '',
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

  const handleAddPassword = () => {
    if (!newPassword.title || !newPassword.password || !newPassword.groupId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const passwordEntry: Password = {
      id: Date.now().toString(),
      ...newPassword
    };

    setPasswords([...passwords, passwordEntry]);
    setNewPassword({ title: '', username: '', password: '', category: '', groupId: '' });
    setShowAddForm(false);
    toast({
      title: "Success",
      description: "Password added successfully",
    });
  };

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.groupId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
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
      title: "Success",
      description: "Category added successfully",
    });
  };

  const handleAddGroup = () => {
    if (!newGroup.name) {
      toast({
        title: "Error",
        description: "Please provide a group name",
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
      title: "Success",
      description: "Permission group added successfully",
    });
  };

  const handleUserSelect = (user: User) => {
    setCurrentUser(user);
    toast({
      title: "User Changed",
      description: `Now viewing as ${user.fullName}`,
    });
  };

  // Only show groups that the current user has access to
  const userGroups = groups.filter(group => 
    currentUser.role === 'admin' || currentUser.groups.includes(group.id)
  );

  // Only show categories in the groups the user has access to
  const userCategories = categories.filter(category => 
    currentUser.role === 'admin' || currentUser.groups.includes(category.groupId)
  );

  // Filter passwords based on search and user permissions
  const filteredPasswords = passwords.filter(
    pass => (currentUser.role === 'admin' || currentUser.groups.includes(pass.groupId)) &&
            (pass.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             pass.username.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <Card className="p-6 backdrop-blur-sm bg-white/90 shadow-lg">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-800">Password Vault</h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Logged in as: </span>
                <Select 
                  value={currentUser.id} 
                  onValueChange={(value) => {
                    const selectedUser = users.find(u => u.id === value);
                    if (selectedUser) handleUserSelect(selectedUser);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.fullName} ({user.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="passwords" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Passwords
                </TabsTrigger>
                <TabsTrigger value="categories" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Categories
                </TabsTrigger>
                {currentUser.role === 'admin' && (
                  <TabsTrigger value="users" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Users & Groups
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="passwords" className="mt-4 space-y-4">
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Search passwords..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="gap-2"
                  >
                    <Plus className="h-5 w-5" />
                    Add Password
                  </Button>
                </div>

                {showAddForm && (
                  <Card className="p-4 animate-fade-in">
                    <div className="space-y-4">
                      <Input
                        placeholder="Title"
                        value={newPassword.title}
                        onChange={(e) => setNewPassword({...newPassword, title: e.target.value})}
                      />
                      <Input
                        placeholder="Username"
                        value={newPassword.username}
                        onChange={(e) => setNewPassword({...newPassword, username: e.target.value})}
                      />
                      <div className="flex gap-4">
                        <Input
                          placeholder="Password"
                          type="password"
                          value={newPassword.password}
                          onChange={(e) => setNewPassword({...newPassword, password: e.target.value})}
                        />
                        <PasswordGenerator onGenerate={(pwd) => setNewPassword({...newPassword, password: pwd})} />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Select 
                            value={newPassword.groupId} 
                            onValueChange={(value) => setNewPassword({...newPassword, groupId: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select group" />
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
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
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
                        <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                        <Button onClick={handleAddPassword}>Save</Button>
                      </div>
                    </div>
                  </Card>
                )}

                <PasswordList 
                  passwords={filteredPasswords} 
                  categories={categories}
                  groups={groups}
                />
              </TabsContent>

              <TabsContent value="categories" className="mt-4 space-y-4">
                <div className="grid gap-4">
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="Category Name"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                      />
                      <Select 
                        value={newCategory.groupId} 
                        onValueChange={(value) => setNewCategory({...newCategory, groupId: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select group" />
                        </SelectTrigger>
                        <SelectContent>
                          {userGroups.map(group => (
                            <SelectItem key={group.id} value={group.id}>
                              {group.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button onClick={handleAddCategory} className="col-span-2">Add Category</Button>
                    </div>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userCategories.map(category => {
                      const group = groups.find(g => g.id === category.groupId);
                      return (
                        <Card key={category.id} className="p-4">
                          <h3 className="font-semibold">{category.name}</h3>
                          <p className="text-sm text-gray-500">Group: {group?.name || 'Unknown'}</p>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>

              {currentUser.role === 'admin' && (
                <TabsContent value="users" className="mt-4">
                  <UserManager 
                    users={users} 
                    setUsers={setUsers} 
                    groups={groups} 
                    setGroups={setGroups} 
                  />
                </TabsContent>
              )}
            </Tabs>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PasswordVault;
