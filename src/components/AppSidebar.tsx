
import React from 'react';
import { User } from './PasswordVault';
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lock, Users, Tag, LogOut } from 'lucide-react';

interface AppSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User;
  users: User[];
  handleUserSelect: (user: User) => void;
  onLogout: () => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  currentUser, 
  users, 
  handleUserSelect,
  onLogout
}) => {
  return (
    <div className="w-64 bg-white flex-shrink-0 border-r border-gray-200 shadow-sm flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold text-teal-700 mb-2">Gestor de Senhas</h1>
        <p className="text-sm text-teal-600">v1.0</p>
      </div>

      <div className="p-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="mb-2">
            <span className="text-xs font-medium text-teal-600">Logado como:</span>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-semibold mr-2">
              {currentUser.fullName.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-medium text-teal-900">{currentUser.fullName}</p>
              <p className="text-xs text-teal-600">{currentUser.role === 'admin' ? 'Administrador' : 'Usuário'}</p>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          <li>
            <Button
              variant={activeTab === "passwords" ? "default" : "ghost"}
              className={`w-full justify-start font-normal ${
                activeTab === "passwords" 
                  ? "bg-teal-700 hover:bg-teal-800 text-white" 
                  : "text-teal-700 hover:bg-teal-50"
              }`}
              onClick={() => setActiveTab("passwords")}
            >
              <Lock className="h-5 w-5 mr-2" />
              Senhas
            </Button>
          </li>
          <li>
            <Button
              variant={activeTab === "categories" ? "default" : "ghost"}
              className={`w-full justify-start font-normal ${
                activeTab === "categories" 
                  ? "bg-teal-700 hover:bg-teal-800 text-white" 
                  : "text-teal-700 hover:bg-teal-50"
              }`}
              onClick={() => setActiveTab("categories")}
            >
              <Tag className="h-5 w-5 mr-2" />
              Categorias
            </Button>
          </li>
          {currentUser.role === 'admin' && (
            <li>
              <Button
                variant={activeTab === "users" ? "default" : "ghost"}
                className={`w-full justify-start font-normal ${
                  activeTab === "users" 
                    ? "bg-teal-700 hover:bg-teal-800 text-white" 
                    : "text-teal-700 hover:bg-teal-50"
                }`}
                onClick={() => setActiveTab("users")}
              >
                <Users className="h-5 w-5 mr-2" />
                Usuários
              </Button>
            </li>
          )}
        </ul>
      </nav>

      <div className="p-4 mt-auto border-t border-gray-200">
        <Button 
          variant="outline" 
          className="w-full justify-start text-teal-700 border-teal-200 hover:bg-teal-50"
          onClick={onLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Sair
        </Button>
      </div>
    </div>
  );
};

export default AppSidebar;
