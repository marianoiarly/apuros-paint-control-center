import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Eye, Calendar, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { SaleForm } from '@/components/SaleForm';
import { getDatabase } from '@/lib/database';

const SalesPage = () => {
  const [sales, setSales] = useState<any[]>([]);
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = () => {
    const db = getDatabase();
    setSales(db.sales || []);
  };

  const filteredSales = sales.filter(sale => {
    const matchesSearch = (sale.customer || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || sale.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  const getStatusText = (status: string) => {
    const texts = {
      completed: 'Concluída',
      pending: 'Pendente',
      cancelled: 'Cancelada'
    };
    return texts[status as keyof typeof texts] || status;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">Vendas</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie todas as vendas da sua loja
          </p>
        </div>
        <Button onClick={() => setShowSaleForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nova Venda
        </Button>
      </div>

      <Card className="paint-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black dark:text-white">
            <ShoppingCart className="h-5 w-5" />
            Histórico de Vendas
          </CardTitle>
          <div className="flex gap-4 mt-4">
            <div className="flex-1">
              <Input
                placeholder="Pesquisar por cliente ou número da venda..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="completed">Concluídas</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="cancelled">Canceladas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredSales.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">Nenhuma venda encontrada</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {sales.length === 0 ? 'Faça sua primeira venda clicando em "Nova Venda"' : 'Tente ajustar os filtros de pesquisa'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSales.map((sale) => (
                <div key={sale.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-black dark:text-white">Venda #{sale.id}</span>
                        <Badge className={getStatusBadge(sale.status)}>
                          {getStatusText(sale.status)}
                        </Badge>
                      </div>
                      <p className="text-black dark:text-white">Cliente: {sale.customer}</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        {new Date(sale.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-black dark:text-white">
                        R$ {sale.total.toFixed(2)}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {sale.items.length} {sale.items.length === 1 ? 'item' : 'itens'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <SaleForm 
        open={showSaleForm} 
        onOpenChange={setShowSaleForm} 
        onSuccess={loadSales} 
      />
    </div>
  );
};

export default SalesPage;