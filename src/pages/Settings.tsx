
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from '../components/ThemeToggle';
import { Label } from "@/components/ui/label";

const Settings = () => {
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
