
import React from 'react';
import { User } from './PasswordVault';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lock, Tag, Users } from 'lucide-react';

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
  return (
    <div className="w-64 bg-teal-800 text-white min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Cofre de Senhas</h1>
        <p className="text-teal-200 text-sm">Gerencie suas senhas com segurança</p>
      </div>
      
      <div className="mb-6">
        <Select 
          value={currentUser.id} 
          onValueChange={(value) => {
            const selectedUser = users.find(u => u.id === value);
            if (selectedUser) handleUserSelect(selectedUser);
          }}
        >
          <SelectTrigger className="bg-teal-700 border-teal-600 text-white">
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
        <div className="mt-2 text-sm text-teal-200">
          Logado como: <span className="font-medium">{currentUser.fullName}</span>
        </div>
      </div>
      
      <nav className="space-y-1 flex-1">
        <button
          onClick={() => setActiveTab("passwords")}
          className={`w-full flex items-center gap-2 p-3 rounded-md transition-colors ${
            activeTab === "passwords" ? "bg-teal-700" : "hover:bg-teal-700/50"
          }`}
        >
          <Lock className="h-5 w-5" />
          <span>Senhas</span>
        </button>
        
        <button
          onClick={() => setActiveTab("categories")}
          className={`w-full flex items-center gap-2 p-3 rounded-md transition-colors ${
            activeTab === "categories" ? "bg-teal-700" : "hover:bg-teal-700/50"
          }`}
        >
          <Tag className="h-5 w-5" />
          <span>Categorias</span>
        </button>
        
        {currentUser.role === 'admin' && (
          <button
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center gap-2 p-3 rounded-md transition-colors ${
              activeTab === "users" ? "bg-teal-700" : "hover:bg-teal-700/50"
            }`}
          >
            <Users className="h-5 w-5" />
            <span>Usuários e Grupos</span>
          </button>
        )}
      </nav>
      
      <div className="mt-auto text-sm text-teal-300 pt-4 border-t border-teal-700">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-teal-600 flex items-center justify-center text-white font-medium">
            {currentUser.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium">{currentUser.fullName}</div>
            <div className="text-teal-400 text-xs">
              {currentUser.role === 'admin' ? 'Administrador' : 'Usuário Regular'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSidebar;
