
import React, { useState } from 'react';
import { PasswordCategory } from './PasswordVault';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash, Plus } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

interface CategoryListProps {
  categories: PasswordCategory[];
  onAddCategory: (category: PasswordCategory) => void;
  onDeleteCategory: (id: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ categories, onAddCategory, onDeleteCategory }) => {
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: ''
  });

  const handleAddCategory = () => {
    if (!newCategory.name) {
      toast({
        title: "Erro",
        description: "O nome da categoria é obrigatório",
        variant: "destructive",
      });
      return;
    }

    const category: PasswordCategory = {
      id: Date.now().toString(),
      name: newCategory.name,
      description: newCategory.description
    };

    onAddCategory(category);
    setNewCategory({ name: '', description: '' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Categorias de Senhas</h2>
          <p className="text-gray-500">Gerencie as categorias para organizar suas senhas</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="categoryName">Nome da Categoria</Label>
              <Input
                id="categoryName"
                placeholder="Nome da Categoria"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryDescription">Descrição (opcional)</Label>
              <Input
                id="categoryDescription"
                placeholder="Descrição da Categoria"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button onClick={handleAddCategory} className="bg-teal-700 hover:bg-teal-800">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Categoria
              </Button>
            </div>
          </div>

          <div className="border rounded-md divide-y">
            {categories.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Nenhuma categoria encontrada. Adicione sua primeira categoria acima.
              </div>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-gray-500">{category.description}</p>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500 hover:bg-red-50"
                    onClick={() => onDeleteCategory(category.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryList;
