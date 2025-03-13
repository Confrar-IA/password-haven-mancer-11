
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordVault from '../components/PasswordVault';
import { User } from '../components/PasswordVault';
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('currentUser');
    
    if (!storedUser) {
      toast({
        title: "Acesso negado",
        description: "Você precisa fazer login para acessar esta página",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    try {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      setLoading(false);
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      toast({
        title: "Erro",
        description: "Houve um problema ao carregar seus dados. Por favor, faça login novamente.",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-teal-800">Carregando...</h2>
          <p className="text-gray-500">Preparando seu cofre de senhas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {currentUser && <PasswordVault initialUser={currentUser} />}
    </div>
  );
};

export default Index;
