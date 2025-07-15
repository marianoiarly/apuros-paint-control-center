import { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Search, UserCheck, UserX } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getDatabase, saveDatabase } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';

const UsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'employee',
    phone: '',
    department: '',
    status: 'active'
  });
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const db = getDatabase();
    // Inicializar com usuário padrão se não existir
    if (!db.users || db.users.length === 0) {
      const defaultUsers = [
        {
          id: 1,
          name: 'Administrador',
          email: 'apuros@apuros.com',
          role: 'admin',
          phone: '(11) 99999-9999',
          department: 'Administração',
          status: 'active',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        }
      ];
      db.users = defaultUsers;
      saveDatabase(db);
    }
    setUsers(db.users || []);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const db = getDatabase();
    
    if (editingUser) {
      // Editar usuário existente
      const userIndex = db.users.findIndex(u => u.id === editingUser.id);
      if (userIndex !== -1) {
        db.users[userIndex] = {
          ...db.users[userIndex],
          ...formData,
          updatedAt: new Date().toISOString()
        };
      }
      toast({
        title: "Usuário atualizado!",
        description: `${formData.name} foi atualizado com sucesso.`,
      });
    } else {
      // Criar novo usuário
      const newUser = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString(),
        lastLogin: null
      };
      db.users = [...(db.users || []), newUser];
      toast({
        title: "Usuário cadastrado!",
        description: `${formData.name} foi cadastrado com sucesso.`,
      });
    }

    saveDatabase(db);
    setUsers(db.users);
    setShowUserForm(false);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'employee',
      phone: '',
      department: '',
      status: 'active'
    });
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      department: user.department || '',
      status: user.status
    });
    setShowUserForm(true);
  };

  const handleDelete = (userId: number) => {
    if (userId === 1) {
      toast({
        title: "Erro",
        description: "Não é possível excluir o usuário administrador padrão.",
        variant: "destructive"
      });
      return;
    }

    const db = getDatabase();
    db.users = db.users.filter(u => u.id !== userId);
    saveDatabase(db);
    setUsers(db.users);
    
    toast({
      title: "Usuário excluído",
      description: "O usuário foi removido do sistema.",
    });
  };

  const toggleUserStatus = (userId: number) => {
    const db = getDatabase();
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      const currentStatus = db.users[userIndex].status;
      db.users[userIndex].status = currentStatus === 'active' ? 'inactive' : 'active';
      db.users[userIndex].updatedAt = new Date().toISOString();
      saveDatabase(db);
      setUsers(db.users);
      
      toast({
        title: "Status atualizado",
        description: `Usuário ${db.users[userIndex].status === 'active' ? 'ativado' : 'desativado'} com sucesso.`,
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    const roles = {
      admin: { label: 'Administrador', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
      manager: { label: 'Gerente', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
      employee: { label: 'Funcionário', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
      vendor: { label: 'Vendedor', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' }
    };
    return roles[role as keyof typeof roles] || roles.employee;
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? { label: 'Ativo', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' }
      : { label: 'Inativo', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">Usuários</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie os usuários do sistema
          </p>
        </div>
        <Dialog open={showUserForm} onOpenChange={(open) => {
          setShowUserForm(open);
          if (!open) {
            setEditingUser(null);
            setFormData({
              name: '',
              email: '',
              role: 'employee',
              phone: '',
              department: '',
              status: 'active'
            });
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-black dark:text-white">
                {editingUser ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-black dark:text-white">Nome Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-black dark:text-white">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role" className="text-black dark:text-white">Cargo</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="manager">Gerente</SelectItem>
                      <SelectItem value="employee">Funcionário</SelectItem>
                      <SelectItem value="vendor">Vendedor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="department" className="text-black dark:text-white">Departamento</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone" className="text-black dark:text-white">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div>
                  <Label htmlFor="status" className="text-black dark:text-white">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowUserForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingUser ? 'Atualizar' : 'Cadastrar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-black dark:text-white">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                placeholder="Pesquisar por nome ou e-mail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por cargo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os cargos</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="manager">Gerente</SelectItem>
                  <SelectItem value="employee">Funcionário</SelectItem>
                  <SelectItem value="vendor">Vendedor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black dark:text-white">
            <Users className="h-5 w-5" />
            Usuários do Sistema
          </CardTitle>
          <CardDescription>
            {filteredUsers.length} usuário(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">Nenhum usuário encontrado</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {users.length === 0 ? 'Cadastre o primeiro usuário' : 'Tente ajustar os filtros de pesquisa'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => {
                const roleInfo = getRoleBadge(user.role);
                const statusInfo = getStatusBadge(user.status);
                
                return (
                  <div key={user.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-4 flex-1">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                          <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-4">
                            <span className="font-semibold text-black dark:text-white">{user.name}</span>
                            <Badge className={roleInfo.color}>
                              {roleInfo.label}
                            </Badge>
                            <Badge className={statusInfo.color}>
                              {statusInfo.label}
                            </Badge>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                            {user.phone && <span>Tel: {user.phone}</span>}
                            {user.department && <span>Depto: {user.department}</span>}
                            {user.lastLogin && (
                              <span>Último acesso: {new Date(user.lastLogin).toLocaleDateString('pt-BR')}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleUserStatus(user.id)}
                          disabled={user.id === 1} // Não permitir desativar o admin padrão
                        >
                          {user.status === 'active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                          disabled={user.id === 1} // Não permitir excluir o admin padrão
                        >
                          <Trash2 className="h-4 w-4" />
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

export default UsersPage;