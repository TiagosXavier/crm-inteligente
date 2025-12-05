import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  UserCog,
  Circle,
  Shield,
  Users,
  Loader2
} from 'lucide-react';

const statusColors = {
  online: 'bg-emerald-500',
  away: 'bg-amber-500',
  offline: 'bg-slate-500',
};

const statusLabels = {
  online: 'Online',
  away: 'Ausente',
  offline: 'Offline',
};

const roleLabels = {
  admin: 'Administrador',
  supervisor: 'Supervisor',
  user: 'Atendente',
};

const roleColors = {
  admin: 'bg-rose-500',
  supervisor: 'bg-amber-500',
  user: 'bg-blue-500',
};

export default function Team() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    role: 'user',
    status: 'offline',
    max_simultaneous: 5,
    is_active: true,
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.User.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({ title: 'Usuário atualizado com sucesso!' });
      closeForm();
    },
  });

  const isAdmin = currentUser?.role === 'admin';
  const isSupervisor = currentUser?.role === 'supervisor';

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const openForm = (user = null) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        role: user.role || 'user',
        status: user.status || 'offline',
        max_simultaneous: user.max_simultaneous || 5,
        is_active: user.is_active !== false,
      });
    } else {
      setSelectedUser(null);
      setFormData({
        full_name: '',
        email: '',
        role: 'user',
        status: 'offline',
        max_simultaneous: 5,
        is_active: true,
      });
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedUser(null);
  };

  const handleSave = () => {
    if (selectedUser) {
      // Only update editable fields - NEVER try to update email or full_name for built-in User
      const updateData = {
        status: formData.status,
        max_simultaneous: formData.max_simultaneous,
        is_active: formData.is_active,
      };
      updateMutation.mutate({ id: selectedUser.id, data: updateData });
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const stats = {
    total: users.length,
    online: users.filter(u => u.status === 'online').length,
    admins: users.filter(u => u.role === 'admin').length,
    supervisors: users.filter(u => u.role === 'supervisor').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Equipe</h1>
          <p className="text-slate-400">Gerencie os agentes do seu time</p>
        </div>
        {isAdmin && (
          <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2" disabled>
            <Plus className="w-4 h-4" />
            Convidar Usuário
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/20">
                <Users className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-xs text-slate-400">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <Circle className="w-5 h-5 text-emerald-400 fill-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.online}</p>
                <p className="text-xs text-slate-400">Online</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-500/20">
                <Shield className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.admins}</p>
                <p className="text-xs text-slate-400">Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <UserCog className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.supervisors}</p>
                <p className="text-xs text-slate-400">Supervisores</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-48 bg-slate-800 border-slate-700">
                <Shield className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Cargo" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">Todos os Cargos</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="supervisor">Supervisor</SelectItem>
                <SelectItem value="user">Atendente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-14 h-14 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 mx-auto mb-3 text-slate-600" />
            <p className="text-slate-400">Nenhum usuário encontrado</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <Card
              key={user.id}
              className={`bg-slate-900 border-slate-800 hover:border-slate-700 transition-all ${
                user.is_active === false ? 'opacity-60' : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="w-14 h-14 border-2 border-slate-700">
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback className="bg-indigo-600 text-white text-lg">
                          {getInitials(user.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-slate-900 ${statusColors[user.status || 'offline']}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{user.full_name}</h3>
                      <p className="text-sm text-slate-400">{user.email}</p>
                    </div>
                  </div>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openForm(user)}
                      className="text-slate-400 hover:text-white"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge className={`${roleColors[user.role]} text-white border-0`}>
                      {roleLabels[user.role]}
                    </Badge>
                    {user.is_active === false && (
                      <Badge variant="secondary" className="bg-slate-700">Inativo</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-slate-400">
                    <Circle className={`w-2 h-2 ${statusColors[user.status || 'offline']} rounded-full`} />
                    {statusLabels[user.status || 'offline']}
                  </div>
                </div>

                {user.max_simultaneous && (
                  <div className="mt-4 pt-4 border-t border-slate-800">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Atendimentos simultâneos:</span>
                      <span className="text-white font-medium">{user.max_simultaneous}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-slate-800 rounded-lg">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-indigo-600 text-white">
                  {getInitials(formData.full_name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{formData.full_name}</p>
                <p className="text-sm text-slate-400">{formData.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(v) => setFormData({ ...formData, status: v })}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Atendimentos Simultâneos</Label>
              <Input
                type="number"
                min={1}
                max={20}
                value={formData.max_simultaneous}
                onChange={(e) => setFormData({ ...formData, max_simultaneous: parseInt(e.target.value) || 5 })}
                className="bg-slate-800 border-slate-700"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
              <div>
                <Label>Usuário Ativo</Label>
                <p className="text-sm text-slate-400">Pode acessar o sistema</p>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeForm}>Cancelar</Button>
            <Button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}