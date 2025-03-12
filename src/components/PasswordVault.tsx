
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PasswordList from './PasswordList';
import PasswordGenerator from './PasswordGenerator';
import { Eye, EyeOff, Search, Plus } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

export type Password = {
  id: string;
  title: string;
  username: string;
  password: string;
  category: string;
};

const PasswordVault = () => {
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPassword, setNewPassword] = useState({
    title: '',
    username: '',
    password: '',
    category: 'general'
  });

  const handleAddPassword = () => {
    if (!newPassword.title || !newPassword.password) {
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
    setNewPassword({ title: '', username: '', password: '', category: 'general' });
    setShowAddForm(false);
    toast({
      title: "Success",
      description: "Password added successfully",
    });
  };

  const filteredPasswords = passwords.filter(
    pass => pass.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           pass.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="p-6 backdrop-blur-sm bg-white/90 shadow-lg">
          <div className="flex flex-col space-y-4">
            <h1 className="text-3xl font-bold text-gray-800">Password Vault</h1>
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
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                    <Button onClick={handleAddPassword}>Save</Button>
                  </div>
                </div>
              </Card>
            )}

            <PasswordList passwords={filteredPasswords} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PasswordVault;
