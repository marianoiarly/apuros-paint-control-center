import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Product, saveProduct } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSuccess: () => void;
}

export const ProductForm = ({ open, onOpenChange, product, onSuccess }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    brand: product?.brand || '',
    color: product?.color || '',
    category: product?.category || 'Tintas',
    unitOfMeasure: product?.unitOfMeasure || '',
    salePrice: product?.salePrice?.toString() || '',
    stock: product?.stock?.toString() || '',
    minStock: product?.minStock?.toString() || '',
    supplier: product?.supplier || ''
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newProduct: Product = {
        id: product?.id || Date.now().toString(),
        name: formData.name,
        brand: formData.brand,
        color: formData.color,
        category: formData.category,
        unitOfMeasure: formData.unitOfMeasure,
        salePrice: parseFloat(formData.salePrice),
        stock: parseInt(formData.stock),
        minStock: parseInt(formData.minStock),
        supplier: formData.supplier,
        createdAt: product?.createdAt || new Date().toISOString().split('T')[0]
      };

      saveProduct(newProduct);
      
      toast({
        title: "Sucesso!",
        description: product ? "Produto atualizado com sucesso" : "Produto cadastrado com sucesso",
      });

      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        name: '',
        brand: '',
        color: '',
        category: 'Tintas',
        unitOfMeasure: '',
        salePrice: '',
        stock: '',
        minStock: '',
        supplier: ''
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar produto. Verifique os dados.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {product ? 'Editar Produto' : 'Novo Produto'}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados do produto abaixo
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Produto *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ex: Tinta Acrílica Premium"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="brand">Marca *</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                placeholder="Ex: Suvinil"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="color">Cor</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                placeholder="Ex: Branco Neve"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tintas">Tintas</SelectItem>
                  <SelectItem value="Vernizes">Vernizes</SelectItem>
                  <SelectItem value="Primers">Primers</SelectItem>
                  <SelectItem value="Esmaltes">Esmaltes</SelectItem>
                  <SelectItem value="Texturas">Texturas</SelectItem>
                  <SelectItem value="Acessórios">Acessórios</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unitOfMeasure">Unidade de Medida *</Label>
              <Input
                id="unitOfMeasure"
                value={formData.unitOfMeasure}
                onChange={(e) => handleInputChange('unitOfMeasure', e.target.value)}
                placeholder="Ex: Galão 3.6L"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salePrice">Preço de Venda (R$) *</Label>
              <Input
                id="salePrice"
                type="number"
                step="0.01"
                value={formData.salePrice}
                onChange={(e) => handleInputChange('salePrice', e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stock">Estoque Inicial *</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => handleInputChange('stock', e.target.value)}
                placeholder="0"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="minStock">Estoque Mínimo *</Label>
              <Input
                id="minStock"
                type="number"
                value={formData.minStock}
                onChange={(e) => handleInputChange('minStock', e.target.value)}
                placeholder="0"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="supplier">Fornecedor</Label>
            <Input
              id="supplier"
              value={formData.supplier}
              onChange={(e) => handleInputChange('supplier', e.target.value)}
              placeholder="Ex: Distribuidora Cores Ltda"
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="paint">
              {product ? 'Atualizar' : 'Cadastrar'} Produto
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};