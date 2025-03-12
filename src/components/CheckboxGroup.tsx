
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CheckboxItemProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  children: React.ReactNode;
  disabled?: boolean;
  value?: string;
}

interface CheckboxGroupProps {
  children: React.ReactNode;
  label?: string;
  className?: string;
}

export const CheckboxItem: React.FC<CheckboxItemProps> = ({ 
  checked, 
  onCheckedChange, 
  children,
  disabled,
  value 
}) => {
  return (
    <div className="flex items-center space-x-2 py-1">
      <Checkbox 
        id={`checkbox-${value || String(children)}`} 
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        value={value}
      />
      <Label 
        htmlFor={`checkbox-${value || String(children)}`}
        className={`cursor-pointer text-sm ${disabled ? 'opacity-50' : ''}`}
      >
        {children}
      </Label>
    </div>
  );
};

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ children, label, className }) => {
  return (
    <div className={`space-y-1 ${className || ''}`}>
      {label && <div className="text-sm font-medium mb-2">{label}</div>}
      {children}
    </div>
  );
};
