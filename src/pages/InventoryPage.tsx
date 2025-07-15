import { useState, useEffect } from 'react';
import { Package, AlertTriangle, TrendingUp, Plus, Search, Download, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getDatabase, saveDatabase } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';

const InventoryPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [entryData, setEntryData] = useState({
    productId: '',
    quantity: '',
    supplier: '',
    invoiceNumber: '',
    type: 'entry' // entry ou exit
  });
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    const db = getDatabase();
    setProducts(db.products || []);
  };

  const handleStockMovement = (e: React.FormEvent) => {
    e.preventDefault();
    
    const db = getDatabase();
    const productIndex = db.products.findIndex(p => p.id === parseInt(entryData.productId));
    
    if (productIndex === -1) {
      toast({
        title: "Erro",
        description: "Produto não encontrado!",
        variant: "destructive"
      });
      return;
    }

    const quantity = parseInt(entryData.quantity);
    if (entryData.type === 'entry') {
      db.products[productIndex].stock += quantity;
    } else {
      if (db.products[productIndex].stock < quantity) {
        toast({
          title: "Erro",
          description: "Estoque insuficiente!",
          variant: "destructive"
        });
        return;
      }
      db.products[productIndex].stock -= quantity;
    }

    // Registrar movimentação no histórico
    const movement = {
      id: Date.now(),
      productId: parseInt(entryData.productId),
      productName: db.products[productIndex].name,
      type: entryData.type,
      quantity: quantity,
      supplier: entryData.supplier,
      invoiceNumber: entryData.invoiceNumber,
      date: new Date().toISOString()
    };

    db.stockMovements = [...(db.stockMovements || []), movement];
    saveDatabase(db);
    
    setProducts(db.products);
    setShowEntryForm(false);
    setEntryData({
      productId: '',
      quantity: '',
      supplier: '',
      invoiceNumber: '',
      type: 'entry'
    });

    toast({
      title: "Movimentação registrada!",
      description: `${entryData.type === 'entry' ? 'Entrada' : 'Saída'} de ${quantity} unidades registrada com sucesso.`,
    });
  };

  const getStockStatus = (stock: number, minStock: number = 10) => {
    if (stock === 0) return { status: 'empty', text: 'Sem estoque', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' };
    if (stock <= minStock) return { status: 'low', text: 'Estoque baixo', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' };
    return { status: 'good', text: 'Estoque OK', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' };
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockProducts = products.filter(p => p.stock <= 10);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">Controle de Estoque</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitore e gerencie seu estoque de produtos
          </p>
        </div>
        <Dialog open={showEntryForm} onOpenChange={setShowEntryForm}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Package className="h-4 w-4 mr-2" />
              Movimentar Estoque
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-black dark:text-white">Movimentação de Estoque</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleStockMovement} className="space-y-4">
              <div>
                <Label htmlFor="type" className="text-black dark:text-white">Tipo de Movimentação</Label>
                <Select value={entryData.type} onValueChange={(value) => setEntryData({ ...entryData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entrada</SelectItem>
                    <SelectItem value="exit">Saída</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="productId" className="text-black dark:text-white">Produto</Label>
                <Select value={entryData.productId} onValueChange={(value) => setEntryData({ ...entryData, productId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(product => (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        {product.name} - {product.brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="quantity" className="text-black dark:text-white">Quantidade</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={entryData.quantity}
                  onChange={(e) => setEntryData({ ...entryData, quantity: e.target.value })}
                  required
                />
              </div>

              {entryData.type === 'entry' && (
                <>
                  <div>
                    <Label htmlFor="supplier" className="text-black dark:text-white">Fornecedor</Label>
                    <Input
                      id="supplier"
                      value={entryData.supplier}
                      onChange={(e) => setEntryData({ ...entryData, supplier: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="invoiceNumber" className="text-black dark:text-white">Número da Nota</Label>
                    <Input
                      id="invoiceNumber"
                      value={entryData.invoiceNumber}
                      onChange={(e) => setEntryData({ ...entryData, invoiceNumber: e.target.value })}
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowEntryForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Registrar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards de Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black dark:text-white">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black dark:text-white">{products.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black dark:text-white">Estoque Baixo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockProducts.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black dark:text-white">Sem Estoque</CardTitle>
            <Package className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStockProducts.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="paint-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black dark:text-white">
            <Package className="h-5 w-5" />
            Produtos em Estoque
          </CardTitle>
          <div className="flex gap-4 mt-4">
            <div className="flex-1">
              <Input
                placeholder="Pesquisar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">Nenhum produto encontrado</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {products.length === 0 ? 'Cadastre produtos na seção "Produtos"' : 'Tente ajustar os filtros de pesquisa'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => {
                const stockInfo = getStockStatus(product.stock);
                return (
                  <div key={product.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex justify-between items-center">
                      <div className="space-y-2">
                        <div className="flex items-center gap-4">
                          <span className="font-semibold text-black dark:text-white">{product.name}</span>
                          <Badge className={stockInfo.color}>
                            {stockInfo.text}
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">{product.brand} - {product.color}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">Categoria: {product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-black dark:text-white">{product.stock}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{product.unit}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryPage;