
import React, { useState } from 'react';
import { Password, PasswordCategory, PermissionGroup } from './PasswordVault';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Copy, Check, ExternalLink, Trash } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

interface PasswordListProps {
  passwords: Password[];
  categories: PasswordCategory[];
  groups: PermissionGroup[];
  onDelete: (id: string) => void;
}

const PasswordList: React.FC<PasswordListProps> = ({ passwords, categories, groups, onDelete }) => {
  const [visiblePasswords, setVisiblePasswords] = useState<{[key: string]: boolean}>({});
  const [copiedStates, setCopiedStates] = useState<{[key: string]: boolean}>({});

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [id]: true }));
    toast({
      title: "Copiado",
      description: "Senha copiada para a área de transferência",
    });
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Sem categoria';
  };

  const getGroupName = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    return group?.name || 'Desconhecido';
  };

  if (passwords.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhuma senha encontrada.
      </div>
    );
  }

  // Agrupar senhas por grupo para melhor organização
  const passwordsByGroup: { [key: string]: Password[] } = {};
  passwords.forEach(password => {
    const groupKey = password.groupId || 'ungrouped';
    if (!passwordsByGroup[groupKey]) {
      passwordsByGroup[groupKey] = [];
    }
    passwordsByGroup[groupKey].push(password);
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {Object.keys(passwordsByGroup).map(groupId => (
        <div key={groupId} className="space-y-2">
          <h3 className="font-semibold text-lg text-teal-800">{getGroupName(groupId)}</h3>
          <div className="grid gap-4">
            {passwordsByGroup[groupId].map((password) => (
              <Card key={password.id} className="p-4 hover:shadow-md transition-shadow border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg text-teal-900">{password.title}</h3>
                    <p className="text-sm text-gray-500">{password.username}</p>
                    <div className="flex gap-2 mt-1">
                      {password.category && (
                        <Badge variant="outline" className="border-teal-200 text-teal-700">
                          {getCategoryName(password.category)}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => togglePasswordVisibility(password.id)}
                      className="hover:bg-gray-100 text-teal-700"
                    >
                      {visiblePasswords[password.id] ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(password.password, password.id)}
                      className="hover:bg-gray-100 text-teal-700"
                    >
                      {copiedStates[password.id] ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                    </Button>
                    {password.url && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-gray-100 text-teal-700"
                        asChild
                      >
                        <a href={password.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-5 w-5" />
                        </a>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-red-100 text-red-500"
                      onClick={() => onDelete(password.id)}
                    >
                      <Trash className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="font-mono bg-gray-50 p-2 rounded border border-gray-200">
                    {visiblePasswords[password.id] ? password.password : '••••••••'}
                  </div>
                  {password.url && (
                    <div className="mt-1 text-xs text-gray-500 overflow-hidden text-ellipsis">
                      <span className="font-medium">URL:</span> {password.url}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PasswordList;
