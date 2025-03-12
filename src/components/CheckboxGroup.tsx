
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CheckboxItemProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  children: React.ReactNode;
  disabled?: boolean;
}

interface CheckboxGroupProps {
  children: React.ReactNode;
}

export const CheckboxItem: React.FC<CheckboxItemProps> = ({ 
  checked, 
  onCheckedChange, 
  children,
  disabled 
}) => {
  return (
    <div className="flex items-center space-x-2 py-1">
      <Checkbox 
        id={`checkbox-${String(children)}`} 
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
      <Label 
        htmlFor={`checkbox-${String(children)}`}
        className={`cursor-pointer text-sm ${disabled ? 'opacity-50' : ''}`}
      >
        {children}
      </Label>
    </div>
  );
};

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ children }) => {
  return (
    <div className="space-y-1">
      {children}
    </div>
  );
};
