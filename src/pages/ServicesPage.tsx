import { Wrench, Calendar, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ServicesPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Serviços</h1>
        <p className="text-muted-foreground">
          Gerencie os serviços de pintura e acabamento
        </p>
      </div>

      <Card className="paint-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Gestão de Serviços
          </CardTitle>
          <CardDescription>
            Funcionalidade em desenvolvimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Em Desenvolvimento</h3>
            <p className="text-muted-foreground">
              O módulo de serviços com agendamento, equipes e acompanhamento será implementado
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicesPage;