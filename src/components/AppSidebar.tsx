
import React from 'react';
import { User } from './PasswordVault';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut, Key, Cog, Users, FileText } from 'lucide-react';
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
    // Create a custom event to log the logout action
    const logoutEvent = new CustomEvent('user-logout', {
      detail: { userId: currentUser.id, username: currentUser.username }
    });
    window.dispatchEvent(logoutEvent);
    
    localStorage.removeItem('currentUser');
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso"
    });
    navigate('/login');
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="w-16 md:w-64 h-screen flex flex-col bg-card border-r border-border">
      <div className="p-4 flex flex-col items-center md:items-start">
        <h1 className="text-lg font-bold hidden md:block text-foreground">Password Vault</h1>
        <p className="text-xs text-muted-foreground hidden md:block">Gerenciador de Senhas</p>
      </div>

      <div className="p-2 flex-1">
        <nav className="space-y-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTab === 'passwords' ? 'secondary' : 'ghost'}
                  className="w-full justify-start text-left"
                  onClick={() => setActiveTab('passwords')}
                >
                  <Key className="h-5 w-5 mr-2" />
                  <span className="hidden md:inline">Senhas</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="md:hidden">
                Senhas
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {currentUser.role === 'admin' && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeTab === 'management' ? 'secondary' : 'ghost'}
                    className="w-full justify-start text-left"
                    onClick={() => setActiveTab('management')}
                  >
                    <Users className="h-5 w-5 mr-2" />
                    <span className="hidden md:inline">Gerenciamento</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="md:hidden">
                  Gerenciamento
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {currentUser.role === 'admin' && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeTab === 'logs' ? 'secondary' : 'ghost'}
                    className="w-full justify-start text-left"
                    onClick={() => setActiveTab('logs')}
                  >
                    <FileText className="h-5 w-5 mr-2" />
                    <span className="hidden md:inline">Logs</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="md:hidden">
                  Logs
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTab === 'settings' ? 'secondary' : 'ghost'}
                  className="w-full justify-start text-left"
                  onClick={() => setActiveTab('settings')}
                >
                  <Cog className="h-5 w-5 mr-2" />
                  <span className="hidden md:inline">Configurações</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="md:hidden">
                Configurações
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </div>

      <div className="p-4 border-t border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start text-left">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getUserInitials(currentUser.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block overflow-hidden">
                <p className="text-sm font-medium text-foreground truncate">{currentUser.fullName}</p>
                <p className="text-xs text-muted-foreground truncate">@{currentUser.username}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5 text-sm md:hidden">
              <p className="font-medium text-foreground">{currentUser.fullName}</p>
              <p className="text-xs text-muted-foreground">@{currentUser.username}</p>
            </div>
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default AppSidebar;
