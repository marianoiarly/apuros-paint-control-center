import { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  ShoppingCart,
  Plus,
  Wrench,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getDashboardStats, getProducts } from '@/lib/database';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  dailySales: number;
  servicesCount: number;
  lowStockCount: number;
  totalProducts: number;
}

export const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    dailySales: 0,
    servicesCount: 0,
    lowStockCount: 0,
    totalProducts: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const dashboardStats = getDashboardStats();
    setStats(dashboardStats);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const quickActions = [
    {
      title: 'Nova Venda',
      description: 'Registrar uma nova venda',
      icon: ShoppingCart,
      action: () => navigate('/sales'),
      variant: 'paint' as const
    },
    {
      title: 'Novo Produto',
      description: 'Cadastrar produto no estoque',
      icon: Package,
      action: () => navigate('/products'),
      variant: 'success' as const
    },
    {
      title: 'Novo Serviço',
      description: 'Agendar serviço de pintura',
      icon: Wrench,
      action: () => navigate('/services'),
      variant: 'secondary' as const
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do seu negócio - {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="paint-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Hoje</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(stats.dailySales)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total em vendas realizadas hoje
            </p>
          </CardContent>
        </Card>

        <Card className="paint-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Serviços Hoje</CardTitle>
            <Wrench className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              {stats.servicesCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Serviços agendados para hoje
            </p>
          </CardContent>
        </Card>

        <Card className="paint-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {stats.lowStockCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Produtos com estoque baixo
            </p>
          </CardContent>
        </Card>

        <Card className="paint-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produtos</CardTitle>
            <Package className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {stats.totalProducts}
            </div>
            <p className="text-xs text-muted-foreground">
              Produtos cadastrados no sistema
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="paint-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Ações Rápidas
            </CardTitle>
            <CardDescription>
              Acesse rapidamente as principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <action.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{action.title}</h4>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </div>
                <Button variant={action.variant} size="sm" onClick={action.action}>
                  Acessar
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="paint-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Atividade Recente
            </CardTitle>
            <CardDescription>
              Últimas movimentações do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Venda realizada</p>
                  <p className="text-xs text-muted-foreground">
                    Pedro Costa - {formatCurrency(179.80)} - há 2 horas
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-warning/10 rounded-lg">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Estoque baixo</p>
                  <p className="text-xs text-muted-foreground">
                    Tinta Látex Econômica - 3 unidades restantes
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Serviço agendado</p>
                  <p className="text-xs text-muted-foreground">
                    Maria Santos - Textura Decorativa - amanhã
                  </p>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={() => navigate('/history')}>
              Ver Todo Histórico
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart Placeholder */}
      <Card className="paint-card">
        <CardHeader>
          <CardTitle>Vendas da Semana</CardTitle>
          <CardDescription>
            Acompanhe o desempenho das vendas nos últimos 7 dias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center bg-muted/30 rounded-lg">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Gráfico de vendas será implementado</p>
              <p className="text-sm text-muted-foreground">com bibliotecas de gráficos</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};