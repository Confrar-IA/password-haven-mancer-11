
import React from 'react';
import { User } from './PasswordVault';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Lock, Tag, Users, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";

interface AppSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User;
  users: User[];
  handleUserSelect: (user: User) => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  currentUser, 
  users, 
  handleUserSelect 
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso",
    });
    navigate('/login');
  };

  return (
    <div className="w-64 bg-white text-teal-800 h-screen p-4 flex flex-col overflow-hidden">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-teal-800 mb-1">Cofre de Senhas</h1>
        <p className="text-teal-600 text-sm">Gerencie suas senhas com segurança</p>
      </div>
      
      <div className="mb-6">
        <Select 
          value={currentUser.id} 
          onValueChange={(value) => {
            const selectedUser = users.find(u => u.id === value);
            if (selectedUser) handleUserSelect(selectedUser);
          }}
        >
          <SelectTrigger className="bg-teal-50 border-teal-200 text-teal-800">
            <SelectValue placeholder="Selecionar usuário" />
          </SelectTrigger>
          <SelectContent>
            {users.map(user => (
              <SelectItem key={user.id} value={user.id}>
                {user.fullName} ({user.role === 'admin' ? 'Admin' : 'Usuário'})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="mt-2 text-sm text-teal-600">
          Logado como: <span className="font-medium">{currentUser.fullName}</span>
        </div>
      </div>
      
      <nav className="space-y-1 flex-1 overflow-y-auto">
        <button
          onClick={() => setActiveTab("passwords")}
          className={`w-full flex items-center gap-2 p-3 rounded-md transition-colors ${
            activeTab === "passwords" ? "bg-teal-50 text-teal-800" : "hover:bg-teal-50/50 text-teal-700"
          }`}
        >
          <Lock className="h-5 w-5" />
          <span>Senhas</span>
        </button>
        
        <button
          onClick={() => setActiveTab("categories")}
          className={`w-full flex items-center gap-2 p-3 rounded-md transition-colors ${
            activeTab === "categories" ? "bg-teal-50 text-teal-800" : "hover:bg-teal-50/50 text-teal-700"
          }`}
        >
          <Tag className="h-5 w-5" />
          <span>Categorias</span>
        </button>
        
        {currentUser.role === 'admin' && (
          <button
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center gap-2 p-3 rounded-md transition-colors ${
              activeTab === "users" ? "bg-teal-50 text-teal-800" : "hover:bg-teal-50/50 text-teal-700"
            }`}
          >
            <Users className="h-5 w-5" />
            <span>Usuários e Grupos</span>
          </button>
        )}
      </nav>
      
      <div className="mt-auto text-sm text-teal-700 pt-4 border-t border-teal-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-teal-600 flex items-center justify-center text-white font-medium">
              {currentUser.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-medium">{currentUser.fullName}</div>
              <div className="text-teal-600 text-xs">
                {currentUser.role === 'admin' ? 'Administrador' : 'Usuário Regular'}
              </div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout}
            className="text-teal-700 hover:text-red-500 hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppSidebar;
