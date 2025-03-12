
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
import { Plus, UserPlus, Shield, X } from 'lucide-react';
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
    groups: []
  });

  const [newGroup, setNewGroup] = useState<Omit<PermissionGroup, 'id'>>({
    name: '',
    description: ''
  });

  const handleAddUser = () => {
    if (!newUser.username || !newUser.fullName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const userEntry: User = {
      id: Date.now().toString(),
      ...newUser
    };

    setUsers([...users, userEntry]);
    setNewUser({ username: '', fullName: '', role: 'user', groups: [] });
    toast({
      title: "Success",
      description: "User added successfully"
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
      description: "Group added successfully"
    });
  };

  const handleRemoveUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: "Success",
      description: "User removed successfully"
    });
  };

  const handleRemoveGroup = (groupId: string) => {
    setGroups(groups.filter(group => group.id !== groupId));
    toast({
      title: "Success",
      description: "Group removed successfully"
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
          Users
        </TabsTrigger>
        <TabsTrigger value="groups" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Permission Groups
        </TabsTrigger>
      </TabsList>

      <TabsContent value="users" className="space-y-4 mt-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Add New User</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Full Name"
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value: 'admin' | 'user') => setNewUser({...newUser, role: value})}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="user">Regular User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Access Groups</Label>
                <div className="border rounded-md p-3 space-y-2">
                  <CheckboxGroup>
                    {groups.map(group => (
                      <CheckboxItem
                        key={group.id}
                        checked={newUser.groups.includes(group.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewUser({...newUser, groups: [...newUser.groups, group.id]});
                          } else {
                            setNewUser({...newUser, groups: newUser.groups.filter(g => g !== group.id)});
                          }
                        }}
                      >
                        {group.name}
                      </CheckboxItem>
                    ))}
                  </CheckboxGroup>
                </div>
              </div>

              <Button onClick={handleAddUser} className="mt-4 col-span-2">
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map(user => (
            <Card key={user.id} className="relative overflow-hidden">
              <Button 
                variant="destructive" 
                size="icon" 
                className="absolute right-2 top-2 h-8 w-8 rounded-full z-10"
                onClick={() => handleRemoveUser(user.id)}
              >
                <X className="h-4 w-4" />
              </Button>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg">{user.fullName}</h3>
                <p className="text-sm text-gray-500">@{user.username}</p>
                <Badge className="mt-1" variant={user.role === 'admin' ? 'default' : 'outline'}>
                  {user.role === 'admin' ? 'Administrator' : 'User'}
                </Badge>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Access Groups:</h4>
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
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="groups" className="space-y-4 mt-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Add New Permission Group</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="groupName">Group Name</Label>
                <Input
                  id="groupName"
                  placeholder="Group Name"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="groupDescription">Description</Label>
                <Input
                  id="groupDescription"
                  placeholder="Description"
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                />
              </div>

              <Button onClick={handleAddGroup} className="mt-4 col-span-2">
                <Plus className="h-4 w-4 mr-2" />
                Add Group
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map(group => (
            <Card key={group.id} className="relative overflow-hidden">
              <Button 
                variant="destructive" 
                size="icon" 
                className="absolute right-2 top-2 h-8 w-8 rounded-full z-10"
                onClick={() => handleRemoveGroup(group.id)}
              >
                <X className="h-4 w-4" />
              </Button>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg">{group.name}</h3>
                <p className="text-sm text-gray-500">{group.description}</p>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Users with access:</h4>
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
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default UserManager;
