import { useState, useEffect } from 'react';
import { Wrench, Plus, Calendar, Users, Clock, MapPin, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getDatabase, saveDatabase } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';

const ServicesPage = () => {
  const [services, setServices] = useState<any[]>([]);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [formData, setFormData] = useState({
    customer: '',
    serviceType: '',
    description: '',
    price: '',
    date: '',
    address: '',
    status: 'scheduled'
  });
  const { toast } = useToast();

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = () => {
    const db = getDatabase();
    setServices(db.services || []);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newService = {
      id: Date.now(),
      ...formData,
      price: parseFloat(formData.price) || 0,
      createdAt: new Date().toISOString()
    };

    const db = getDatabase();
    db.services = [...(db.services || []), newService];
    saveDatabase(db);
    
    setServices(db.services);
    setShowServiceForm(false);
    setFormData({
      customer: '',
      serviceType: '',
      description: '',
      price: '',
      date: '',
      address: '',
      status: 'scheduled'
    });

    toast({
      title: "Serviço cadastrado com sucesso!",
      description: `Serviço para ${newService.customer} foi agendado.`,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      inProgress: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return variants[status as keyof typeof variants] || variants.scheduled;
  };

  const getStatusText = (status: string) => {
    const texts = {
      scheduled: 'Agendado',
      inProgress: 'Em Andamento',
      completed: 'Concluído',
      cancelled: 'Cancelado'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const updateServiceStatus = (serviceId: number, newStatus: string) => {
    const db = getDatabase();
    const updatedServices = db.services.map((service: any) => 
      service.id === serviceId ? { ...service, status: newStatus } : service
    );
    db.services = updatedServices;
    saveDatabase(db);
    setServices(updatedServices);
    
    toast({
      title: "Status atualizado!",
      description: `Serviço marcado como ${getStatusText(newStatus)}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">Serviços</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie os serviços de pintura e acabamento
          </p>
        </div>
        <Dialog open={showServiceForm} onOpenChange={setShowServiceForm}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Serviço
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-black dark:text-white">Cadastrar Novo Serviço</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customer" className="text-black dark:text-white">Cliente</Label>
                  <Input
                    id="customer"
                    value={formData.customer}
                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="serviceType" className="text-black dark:text-white">Tipo de Serviço</Label>
                  <Select value={formData.serviceType} onValueChange={(value) => setFormData({ ...formData, serviceType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pintura-interna">Pintura Interna</SelectItem>
                      <SelectItem value="pintura-externa">Pintura Externa</SelectItem>
                      <SelectItem value="pintura-comercial">Pintura Comercial</SelectItem>
                      <SelectItem value="acabamento">Acabamento</SelectItem>
                      <SelectItem value="textura">Textura</SelectItem>
                      <SelectItem value="verniz">Verniz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description" className="text-black dark:text-white">Descrição do Serviço</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva os detalhes do serviço..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price" className="text-black dark:text-white">Valor (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="date" className="text-black dark:text-white">Data de Execução</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address" className="text-black dark:text-white">Endereço</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Endereço onde será executado o serviço"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowServiceForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Cadastrar Serviço
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="paint-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black dark:text-white">
            <Wrench className="h-5 w-5" />
            Serviços Agendados
          </CardTitle>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">Nenhum serviço agendado</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Cadastre seu primeiro serviço clicando em "Novo Serviço"
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {services.map((service) => (
                <div key={service.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-black dark:text-white">{service.customer}</span>
                        <Badge className={getStatusBadge(service.status)}>
                          {getStatusText(service.status)}
                        </Badge>
                      </div>
                      <p className="text-black dark:text-white font-medium">{service.serviceType}</p>
                      {service.description && (
                        <p className="text-gray-600 dark:text-gray-400">{service.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(service.date).toLocaleDateString('pt-BR')}
                        </span>
                        {service.address && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {service.address}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <p className="text-xl font-bold text-black dark:text-white">
                        R$ {(service.price || 0).toFixed(2)}
                      </p>
                      
                      {/* Dropdown de Ações */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreVertical className="h-4 w-4" />
                            Ações
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          {service.status !== 'completed' && (
                            <DropdownMenuItem 
                              onClick={() => updateServiceStatus(service.id, 'completed')}
                              className="text-green-600"
                            >
                              ✓ Marcar como Concluído
                            </DropdownMenuItem>
                          )}
                          {service.status !== 'cancelled' && service.status !== 'completed' && (
                            <DropdownMenuItem 
                              onClick={() => updateServiceStatus(service.id, 'cancelled')}
                              className="text-red-600"
                            >
                              ✕ Cancelar Serviço
                            </DropdownMenuItem>
                          )}
                          {service.status === 'cancelled' && (
                            <DropdownMenuItem 
                              onClick={() => updateServiceStatus(service.id, 'scheduled')}
                              className="text-blue-600"
                            >
                              ↻ Remarcar Serviço
                            </DropdownMenuItem>
                          )}
                          {service.status === 'scheduled' && (
                            <DropdownMenuItem 
                              onClick={() => updateServiceStatus(service.id, 'inProgress')}
                              className="text-yellow-600"
                            >
                              ⏳ Marcar em Andamento
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicesPage;