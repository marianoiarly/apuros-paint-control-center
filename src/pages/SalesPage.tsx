import { ShoppingCart, Plus, CreditCard } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SalesPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Vendas</h1>
        <p className="text-muted-foreground">
          Gerencie todas as vendas da sua loja
        </p>
      </div>

      <Card className="paint-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Sistema de Vendas
          </CardTitle>
          <CardDescription>
            Funcionalidade em desenvolvimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <CreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Em Desenvolvimento</h3>
            <p className="text-muted-foreground">
              O módulo de vendas com carrinho, pagamentos e emissão de recibos será implementado
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesPage;