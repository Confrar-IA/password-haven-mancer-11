
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { ThemeToggle } from '../components/ThemeToggle';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useStorage } from '../hooks/useStorage';
import { StorageType, DatabaseConfig } from '../services/storage/StorageFactory';
import { toast } from "@/components/ui/use-toast";
import { Database, HardDrive, AlertTriangle, Save } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Settings = () => {
  const { storage, storageType, switchStorageType, dbConfig, updateDbConfig } = useStorage();
  const [showDbConfig, setShowDbConfig] = useState(false);

  const form = useForm<DatabaseConfig>({
    defaultValues: dbConfig
  });

  const handleStorageTypeChange = (checked: boolean) => {
    const newStorageType: StorageType = checked ? 'mysql' : 'localStorage';
    
    if (newStorageType === storageType) {
      return; // No change needed
    }
    
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

  const handleDbConfigSubmit = (values: DatabaseConfig) => {
    try {
      updateDbConfig(values);
      toast({
        title: "Configuração salva",
        description: `Configurações de banco de dados atualizadas com sucesso.`,
      });
    } catch (error) {
      console.error('Error updating database config:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar as configurações de banco de dados",
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
                  ? `Os dados estão sendo armazenados no banco de dados MySQL (${dbConfig.name}).` 
                  : 'Os dados estão sendo armazenados localmente no navegador.'}
              </p>
              
              {storageType === 'mysql' && (
                <>
                  <Alert className="mt-4 bg-yellow-50 dark:bg-yellow-950/30">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Atenção</AlertTitle>
                    <AlertDescription>
                      Atualmente o sistema está usando uma simulação de MySQL.
                      Os dados ainda estão sendo armazenados localmente, mas em um espaço separado.
                      Em um ambiente de produção, conecte com um banco MySQL real.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="mt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowDbConfig(!showDbConfig)}
                      className="w-full"
                    >
                      {showDbConfig ? 'Ocultar' : 'Mostrar'} Configurações do Banco de Dados
                    </Button>
                    
                    {showDbConfig && (
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleDbConfigSubmit)} className="space-y-4 mt-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nome do Banco</FormLabel>
                                <FormControl>
                                  <Input placeholder="password_vault" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="host"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Host</FormLabel>
                                <FormControl>
                                  <Input placeholder="localhost" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="port"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Porta</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder="3306" 
                                    {...field} 
                                    onChange={e => field.onChange(parseInt(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="user"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Usuário</FormLabel>
                                <FormControl>
                                  <Input placeholder="root" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Senha</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="********" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button type="submit" className="w-full">
                            <Save className="mr-2 h-4 w-4" />
                            Salvar Configurações
                          </Button>
                        </form>
                      </Form>
                    )}
                  </div>
                </>
              )}
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
