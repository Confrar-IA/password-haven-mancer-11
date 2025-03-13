
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from '../components/ThemeToggle';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useStorage } from '../hooks/useStorage';
import { StorageType } from '../services/storage/StorageFactory';
import { toast } from "@/components/ui/use-toast";
import { Database, HardDrive } from 'lucide-react';

const Settings = () => {
  const { storageType, switchStorageType } = useStorage();

  const handleStorageTypeChange = (checked: boolean) => {
    const newStorageType: StorageType = checked ? 'mysql' : 'localStorage';
    
    try {
      switchStorageType(newStorageType);
      toast({
        title: "Configuração alterada",
        description: `Modo de armazenamento alterado para ${newStorageType === 'mysql' ? 'Banco de Dados MySQL' : 'Armazenamento Local'}`,
      });
    } catch (error) {
      console.error('Error switching storage type:', error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar o modo de armazenamento",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-2xl font-semibold mb-4">Configurações</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Tema</Label>
              <div className="flex items-center gap-4">
                <ThemeToggle />
              </div>
            </div>
            
            <div className="border-t border-border pt-4">
              <h3 className="text-lg font-medium mb-2">Armazenamento</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {storageType === 'mysql' ? 
                    <Database className="h-5 w-5 text-primary" /> : 
                    <HardDrive className="h-5 w-5 text-primary" />
                  }
                  <Label className="text-base font-medium">
                    Usar Banco de Dados MySQL
                  </Label>
                </div>
                <Switch 
                  checked={storageType === 'mysql'} 
                  onCheckedChange={handleStorageTypeChange}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {storageType === 'mysql' 
                  ? 'Os dados estão sendo armazenados no banco de dados MySQL.' 
                  : 'Os dados estão sendo armazenados localmente no navegador.'}
              </p>
            </div>
            
            <div className="border-t border-border pt-4">
              <h3 className="text-lg font-medium mb-2">Sobre o Aplicativo</h3>
              <p className="text-muted-foreground">
                Gerenciador de Senhas - Versão 1.0.0
              </p>
              <p className="text-muted-foreground mt-1">
                Um aplicativo seguro para gerenciar suas senhas e compartilhá-las com sua equipe.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
