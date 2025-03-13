
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Lock, User } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

// Import the User type from PasswordVault
import { User as UserType } from '../components/PasswordVault';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <h1 className="text-2xl font-bold text-teal-800">Cofre de Senhas</h1>
          <p className="text-gray-500">Faça login para acessar suas senhas</p>
        </CardHeader>
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
          
          {users.length > 0 ? (
            <div className="mt-8">
              <h3 className="font-medium text-gray-700 mb-2">Usuários Disponíveis:</h3>
              <div className="border rounded-md divide-y">
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
                      <div className="text-sm text-gray-600">@{user.username}</div>
                      {user.role && (
                        <Badge 
                          variant={user.role === 'admin' ? 'success' : 'secondary'}
                          className="mt-1"
                        >
                          {user.role}
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm bg-gray-100 px-2 py-1 rounded flex items-center">
                      <span className="font-medium">Senha:</span>
                      <span className="ml-1">{user.password || 'Não definida'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-8 text-center p-4 border rounded-md bg-gray-50">
              <p className="text-gray-600">Nenhum usuário encontrado no sistema</p>
              <p className="text-sm text-gray-500 mt-1">
                Crie usuários na tela de gerenciamento de usuários
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
