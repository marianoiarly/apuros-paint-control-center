import { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Calendar, Download, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { getDatabase } from '@/lib/database';

const ReportsPage = () => {
  const [reportType, setReportType] = useState('sales');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const db = getDatabase();
  const sales = db.sales || [];
  const products = db.products || [];
  const services = db.services || [];

  const generateSalesReport = () => {
    const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
    const completedSales = sales.filter(sale => sale.status === 'completed');
    const totalCompletedSales = completedSales.reduce((sum, sale) => sum + sale.total, 0);
    
    return {
      totalSales: sales.length,
      totalRevenue: totalSales,
      completedSales: completedSales.length,
      completedRevenue: totalCompletedSales,
      averageTicket: completedSales.length > 0 ? totalCompletedSales / completedSales.length : 0
    };
  };

  const generateProductsReport = () => {
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.stock <= 10).length;
    const outOfStockProducts = products.filter(p => p.stock === 0).length;
    const totalStockValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);

    return {
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      totalStockValue
    };
  };

  const generateServicesReport = () => {
    const totalServices = services.length;
    const completedServices = services.filter(service => service.status === 'completed');
    const totalRevenue = services.reduce((sum, service) => sum + service.price, 0);
    const completedRevenue = completedServices.reduce((sum, service) => sum + service.price, 0);

    return {
      totalServices,
      completedServices: completedServices.length,
      totalRevenue,
      completedRevenue,
      averageServiceValue: services.length > 0 ? totalRevenue / services.length : 0
    };
  };

  const salesReport = generateSalesReport();
  const productsReport = generateProductsReport();
  const servicesReport = generateServicesReport();

  const handleExportReport = () => {
    // Simulate export functionality
    const reportData = {
      sales: salesReport,
      products: productsReport,
      services: servicesReport,
      generatedAt: new Date().toISOString()
    };
    
    console.log('Exporting report:', reportData);
    // In a real app, this would generate and download a file
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">Relatórios</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Análises e relatórios do sistema
          </p>
        </div>
        <Button onClick={handleExportReport} className="bg-blue-600 hover:bg-blue-700">
          <Download className="h-4 w-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-black dark:text-white">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-black dark:text-white">Tipo de Relatório</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Vendas</SelectItem>
                  <SelectItem value="products">Produtos</SelectItem>
                  <SelectItem value="services">Serviços</SelectItem>
                  <SelectItem value="general">Geral</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-black dark:text-white">Data Inicial</label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-black dark:text-white">Data Final</label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                Filtrar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Relatório de Vendas */}
      {(reportType === 'sales' || reportType === 'general') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-black dark:text-white">
              <BarChart3 className="h-5 w-5" />
              Relatório de Vendas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-black dark:text-white">{salesReport.totalSales}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total de Vendas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">R$ {salesReport.totalRevenue.toFixed(2)}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receita Total</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{salesReport.completedSales}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Vendas Concluídas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">R$ {salesReport.completedRevenue.toFixed(2)}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receita Concluída</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">R$ {salesReport.averageTicket.toFixed(2)}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ticket Médio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Relatório de Produtos */}
      {(reportType === 'products' || reportType === 'general') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-black dark:text-white">
              <PieChart className="h-5 w-5" />
              Relatório de Produtos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-black dark:text-white">{productsReport.totalProducts}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total de Produtos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{productsReport.lowStockProducts}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Estoque Baixo</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{productsReport.outOfStockProducts}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sem Estoque</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">R$ {productsReport.totalStockValue.toFixed(2)}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Valor Total do Estoque</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Relatório de Serviços */}
      {(reportType === 'services' || reportType === 'general') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-black dark:text-white">
              <TrendingUp className="h-5 w-5" />
              Relatório de Serviços
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-black dark:text-white">{servicesReport.totalServices}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total de Serviços</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{servicesReport.completedServices}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Serviços Concluídos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">R$ {servicesReport.totalRevenue.toFixed(2)}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receita Total</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">R$ {servicesReport.completedRevenue.toFixed(2)}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receita Concluída</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">R$ {servicesReport.averageServiceValue.toFixed(2)}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Valor Médio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReportsPage;