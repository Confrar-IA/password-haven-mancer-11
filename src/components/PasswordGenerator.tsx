
import React from 'react';
import { Button } from "@/components/ui/button";
import { Wand2 } from 'lucide-react';

interface PasswordGeneratorProps {
  onGenerate: (password: string) => void;
}

const PasswordGenerator: React.FC<PasswordGeneratorProps> = ({ onGenerate }) => {
  const generatePassword = () => {
    const length = 16;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    
    onGenerate(password);
  };

  return (
    <Button
      variant="outline"
      onClick={generatePassword}
      className="gap-2"
    >
      <Wand2 className="h-4 w-4" />
      Generate
    </Button>
  );
};

export default PasswordGenerator;
