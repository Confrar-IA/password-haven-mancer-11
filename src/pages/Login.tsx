
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Lock, User, UserPlus, LogIn } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import the User type from PasswordVault
import { User as UserType } from '../components/PasswordVault';

const Login = () => {
  // Login state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Registration state
  const [fullName, setFullName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [users, setUsers] = useState<UserType[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load users from localStorage
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      try {
        setUsers(JSON.parse(storedUsers));
      } catch (error) {
        console.error('Error parsing users from localStorage:', error);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find user by username
    const user = users.find(u => u.username === username);
    
    if (user && user.password === password) {
      // Store logged in user in localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      toast({
        title: "Login bem-sucedido",
        description: `Bem-vindo, ${user.fullName}!`,
      });
      navigate('/');
    } else {
      toast({
        title: "Erro de login",
        description: "Nome de usuário ou senha incorretos",
        variant: "destructive",
      });
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    if (!fullName || !newUsername || !newPassword) {
      toast({
        title: "Erro no cadastro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Erro no cadastro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    // Check if username already exists
    if (users.some(user => user.username === newUsername)) {
      toast({
        title: "Erro no cadastro",
        description: "Este nome de usuário já está em uso",
        variant: "destructive",
      });
      return;
    }

    // Create new user
    const newUser: UserType = {
      id: Date.now().toString(),
      username: newUsername,
      password: newPassword,
      fullName: fullName,
      role: users.length === 0 ? 'admin' : 'user', // First user is admin
      groups: []
    };

    // Update users array and localStorage
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Show success message
    toast({
      title: "Cadastro bem-sucedido",
      description: "Sua conta foi criada. Agora você pode fazer login.",
    });

    // Clear registration form
    setFullName('');
    setNewUsername('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <h1 className="text-2xl font-bold text-teal-800">Cofre de Senhas</h1>
          <p className="text-gray-500">Gerencie suas senhas com segurança</p>
        </CardHeader>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid grid-cols-2 w-[80%] mx-auto">
            <TabsTrigger value="login" className="flex items-center gap-1">
              <LogIn className="h-4 w-4" />
              Login
            </TabsTrigger>
            <TabsTrigger value="register" className="flex items-center gap-1">
              <UserPlus className="h-4 w-4" />
              Cadastrar
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Nome de Usuário</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <User className="h-5 w-5" />
                    </span>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10"
                      placeholder="Digite seu nome de usuário"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Lock className="h-5 w-5" />
                    </span>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      placeholder="Digite sua senha"
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-teal-700 hover:bg-teal-800"
                >
                  Entrar
                </Button>
              </form>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="register">
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome Completo</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Digite seu nome completo"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newUsername">Nome de Usuário</Label>
                  <Input
                    id="newUsername"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Escolha um nome de usuário"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Senha</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Escolha uma senha"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme sua senha"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-teal-700 hover:bg-teal-800"
                >
                  Cadastrar
                </Button>
              </form>
            </CardContent>
          </TabsContent>
        </Tabs>
        
        {users.length > 0 && (
          <CardFooter className="flex flex-col">
            <h3 className="font-medium text-gray-700 mb-2">Usuários Disponíveis:</h3>
            <div className="border rounded-md divide-y w-full">
              {users.map((user) => (
                <div 
                  key={user.id} 
                  className="p-3 hover:bg-gray-50 cursor-pointer flex justify-between"
                  onClick={() => {
                    setUsername(user.username);
                    setPassword(user.password || '');
                  }}
                >
                  <div>
                    <div className="font-medium">{user.fullName}</div>
                    <div className="text-sm text-gray-500">@{user.username}</div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Senha: {user.password || 'Não definida'}
                  </div>
                </div>
              ))}
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default Login;
