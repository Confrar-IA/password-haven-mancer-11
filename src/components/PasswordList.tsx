
import React, { useState } from 'react';
import { Password } from './PasswordVault';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Copy, Check } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

interface PasswordListProps {
  passwords: Password[];
}

const PasswordList: React.FC<PasswordListProps> = ({ passwords }) => {
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
      title: "Copied",
      description: "Password copied to clipboard",
    });
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  if (passwords.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No passwords found.
      </div>
    );
  }

  return (
    <div className="grid gap-4 animate-fade-in">
      {passwords.map((password) => (
        <Card key={password.id} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">{password.title}</h3>
              <p className="text-sm text-gray-500">{password.username}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => togglePasswordVisibility(password.id)}
                className="hover:bg-gray-100"
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
                className="hover:bg-gray-100"
              >
                {copiedStates[password.id] ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
          <div className="mt-2">
            <div className="font-mono bg-gray-50 p-2 rounded">
              {visiblePasswords[password.id] ? password.password : '••••••••'}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default PasswordList;
