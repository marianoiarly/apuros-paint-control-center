import { useState, useEffect } from 'react';
import { History, Calendar, Search, Filter, Eye, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { getDatabase } from '@/lib/database';

const HistoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = () => {
    const db = getDatabase();
    
    // Combinar todas as atividades do sistema
    const allActivities = [
      ...(db.sales || []).map(sale => ({
        id: `sale-${sale.id}`,
        type: 'sale',
        title: `Venda #${sale.id}`,
        description: `Cliente: ${sale.customer}`,
        amount: sale.total,
        date: sale.date || sale.createdAt,
        status: sale.status
      })),
      ...(db.services || []).map(service => ({
        id: `service-${service.id}`,
        type: 'service',
        title: `Serviço - ${service.serviceType}`,
        description: `Cliente: ${service.customer}`,
        amount: service.price,
        date: service.date || service.createdAt,
        status: service.status
      })),
      ...(db.products || []).map(product => ({
        id: `product-${product.id}`,
        type: 'product',
        title: `Produto Cadastrado`,
        description: `${product.name} - ${product.brand}`,
        amount: product.price,
        date: product.createdAt || new Date().toISOString(),
        status: 'active'
      })),
      ...(db.stockMovements || []).map(movement => ({
        id: `stock-${movement.id}`,
        type: 'stock',
        title: `${movement.type === 'entry' ? 'Entrada' : 'Saída'} de Estoque`,
        description: `${movement.productName} - ${movement.quantity} unidades`,
        amount: 0,
        date: movement.date,
        status: movement.type
      }))
    ];

    // Ordenar por data (mais recente primeiro)
    allActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setActivities(allActivities);
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || activity.type === filterType;
    const matchesDate = !filterDate || activity.date.startsWith(filterDate);
    
    return matchesSearch && matchesType && matchesDate;
  });

  const getTypeInfo = (type: string) => {
    const types = {
      sale: { label: 'Venda', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
      service: { label: 'Serviço', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
      product: { label: 'Produto', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' },
      stock: { label: 'Estoque', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' }
    };
    return types[type as keyof typeof types] || { label: type, color: 'bg-gray-100 text-gray-800' };
  };

  const getStatusInfo = (status: string, type: string) => {
    if (type === 'stock') {
      return status === 'entry' 
        ? { label: 'Entrada', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' }
        : { label: 'Saída', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' };
    }
    
    const statuses = {
      completed: { label: 'Concluído', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
      pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
      cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
      scheduled: { label: 'Agendado', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
      inProgress: { label: 'Em Andamento', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
      active: { label: 'Ativo', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' }
    };
    return statuses[status as keyof typeof statuses] || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">Histórico</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Visualize todas as atividades do sistema
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Download className="h-4 w-4 mr-2" />
          Exportar Histórico
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-black dark:text-white">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input
                placeholder="Pesquisar atividades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de atividade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="sale">Vendas</SelectItem>
                  <SelectItem value="service">Serviços</SelectItem>
                  <SelectItem value="product">Produtos</SelectItem>
                  <SelectItem value="stock">Estoque</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                placeholder="Data"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Atividades */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black dark:text-white">
            <History className="h-5 w-5" />
            Atividades Recentes
          </CardTitle>
          <CardDescription>
            {filteredActivities.length} atividade(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <History className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">Nenhuma atividade encontrada</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {activities.length === 0 
                  ? 'Ainda não há atividades registradas no sistema' 
                  : 'Tente ajustar os filtros de pesquisa'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredActivities.map((activity) => {
                const typeInfo = getTypeInfo(activity.type);
                const statusInfo = getStatusInfo(activity.status, activity.type);
                
                return (
                  <div key={activity.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-4">
                          <span className="font-semibold text-black dark:text-white">{activity.title}</span>
                          <Badge className={typeInfo.color}>
                            {typeInfo.label}
                          </Badge>
                          <Badge className={statusInfo.color}>
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">{activity.description}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(activity.date).toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right">
                        {activity.amount > 0 && (
                          <p className="text-lg font-bold text-black dark:text-white">
                            R$ {activity.amount.toFixed(2)}
                          </p>
                        )}
                        <Button variant="ghost" size="sm" className="mt-2">
                          <Eye className="h-4 w-4" />
                        </Button>
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

export default HistoryPage;