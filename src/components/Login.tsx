
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from './PasswordVault';
import { LogIn } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

interface LoginProps {
  users: User[];
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ users, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      onLogin(user);
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo, ${user.fullName}!`,
      });
    } else {
      toast({
        title: "Erro de autenticação",
        description: "Nome de usuário ou senha incorretos",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-teal-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md backdrop-blur-sm bg-white/95 shadow-lg border-0">
        <CardContent className="pt-6 pb-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-teal-900 mb-2">Gerenciador de Senhas</h1>
            <p className="text-gray-500">Entre com suas credenciais para acessar</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">Nome de Usuário</label>
              <Input 
                id="username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Digite seu nome de usuário" 
                required 
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Senha</label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Digite sua senha" 
                required 
              />
            </div>

            <Button type="submit" className="w-full bg-teal-700 hover:bg-teal-800">
              <LogIn className="h-4 w-4 mr-2" />
              Entrar
            </Button>
          </form>

          <div className="mt-8 border-t pt-6">
            <h2 className="text-lg font-semibold text-teal-900 mb-4">Usuários do Sistema</h2>
            <div className="space-y-3">
              {users.map(user => (
                <div key={user.id} className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer" onClick={() => {
                  setUsername(user.username);
                  setPassword(user.password || '');
                }}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{user.fullName}</p>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      Senha: {user.password || 'Não definida'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
