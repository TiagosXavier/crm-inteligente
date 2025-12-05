import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import {
  Search,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Phone,
  Mail,
  Building2,
  Users,
  Filter,
  Download,
  Upload
} from 'lucide-react';
import ContactFormDialog from '@/components/contacts/ContactFormDialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusOptions = [
  { value: 'all', label: 'Todos os Status' },
  { value: 'novo', label: 'Novo' },
  { value: 'em_atendimento', label: 'Em Atendimento' },
  { value: 'aguardando', label: 'Aguardando' },
  { value: 'resolvido', label: 'Resolvido' },
  { value: 'escalado', label: 'Escalado' },
];

const statusColors = {
  novo: 'bg-blue-500',
  em_atendimento: 'bg-amber-500',
  aguardando: 'bg-purple-500',
  resolvido: 'bg-emerald-500',
  escalado: 'bg-rose-500',
};

export default function Contacts() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [deleteContact, setDeleteContact] = useState(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => base44.entities.Contact.list('-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Contact.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast({ title: 'Contato criado com sucesso!' });
      setIsFormOpen(false);
    },
    onError: (error) => {
      toast({ title: 'Erro ao criar contato', description: error.message, variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Contact.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast({ title: 'Contato atualizado com sucesso!' });
      setIsFormOpen(false);
      setSelectedContact(null);
    },
    onError: (error) => {
      toast({ title: 'Erro ao atualizar contato', description: error.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Contact.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast({ title: 'Contato excluído com sucesso!' });
      setDeleteContact(null);
    },
    onError: (error) => {
      toast({ title: 'Erro ao excluir contato', description: error.message, variant: 'destructive' });
    },
  });

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name?.toLowerCase().includes(search.toLowerCase()) ||
      contact.phone?.includes(search) ||
      contact.email?.toLowerCase().includes(search.toLowerCase()) ||
      contact.company?.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleSave = (data) => {
    if (selectedContact) {
      updateMutation.mutate({ id: selectedContact.id, data });
    } else {
      createMutation.mutate({ ...data, status: 'novo', is_active: true });
    }
  };

  const handleEdit = (contact) => {
    setSelectedContact(contact);
    setIsFormOpen(true);
  };

  const handleDelete = () => {
    if (deleteContact) {
      deleteMutation.mutate(deleteContact.id);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getStatusLabel = (status) => {
    const option = statusOptions.find(s => s.value === status);
    return option?.label || status;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Contatos</h1>
          <p className="text-slate-400">Gerencie seus clientes e leads</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden md:inline">Exportar</span>
          </Button>
          <Button
            onClick={() => {
              setSelectedContact(null);
              setIsFormOpen(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 gap-2"
          >
            <Plus className="w-4 h-4" />
            Novo Contato
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Buscar por nome, telefone, email ou empresa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-slate-800 border-slate-700">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statusOptions.slice(1).map((status) => {
          const count = contacts.filter(c => c.status === status.value).length;
          return (
            <Card
              key={status.value}
              className={`bg-slate-900 border-slate-800 cursor-pointer transition-all hover:border-slate-600 ${
                statusFilter === status.value ? 'border-indigo-500' : ''
              }`}
              onClick={() => setStatusFilter(statusFilter === status.value ? 'all' : status.value)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${statusColors[status.value]}`} />
                  <div>
                    <p className="text-2xl font-bold text-white">{count}</p>
                    <p className="text-xs text-slate-400">{status.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Table */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-400">Contato</TableHead>
                  <TableHead className="text-slate-400">Telefone</TableHead>
                  <TableHead className="text-slate-400 hidden md:table-cell">Email</TableHead>
                  <TableHead className="text-slate-400 hidden lg:table-cell">Empresa</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                  <TableHead className="text-slate-400 hidden lg:table-cell">Tags</TableHead>
                  <TableHead className="text-slate-400 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i} className="border-slate-800">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Skeleton className="w-10 h-10 rounded-full" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell className="hidden lg:table-cell"><Skeleton className="h-6 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredContacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <Users className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                      <p className="text-slate-400">Nenhum contato encontrado</p>
                      {search && (
                        <Button
                          variant="link"
                          onClick={() => setSearch('')}
                          className="text-indigo-400 mt-2"
                        >
                          Limpar busca
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredContacts.map((contact) => (
                    <TableRow
                      key={contact.id}
                      className="border-slate-800 hover:bg-slate-800/50 cursor-pointer"
                      onClick={() => handleEdit(contact)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-indigo-600 text-white text-sm">
                              {getInitials(contact.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-white">{contact.name}</p>
                            <p className="text-xs text-slate-500">
                              {contact.created_date
                                ? format(new Date(contact.created_date), "dd/MM/yyyy", { locale: ptBR })
                                : ''}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-slate-300">
                          <Phone className="w-4 h-4 text-slate-500" />
                          {contact.phone}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {contact.email ? (
                          <div className="flex items-center gap-2 text-slate-300">
                            <Mail className="w-4 h-4 text-slate-500" />
                            {contact.email}
                          </div>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {contact.company ? (
                          <div className="flex items-center gap-2 text-slate-300">
                            <Building2 className="w-4 h-4 text-slate-500" />
                            {contact.company}
                          </div>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusColors[contact.status]} text-white border-0`}>
                          {getStatusLabel(contact.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex gap-1 flex-wrap">
                          {contact.tags?.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="bg-slate-700 text-slate-300 text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {contact.tags?.length > 2 && (
                            <Badge variant="secondary" className="bg-slate-700 text-slate-300 text-xs">
                              +{contact.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(contact);
                              }}
                              className="text-slate-300 hover:text-white hover:bg-slate-700"
                            >
                              <Pencil className="w-4 h-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteContact(contact);
                              }}
                              className="text-rose-400 hover:text-rose-300 hover:bg-slate-700"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <ContactFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        contact={selectedContact}
        onSave={handleSave}
        isSaving={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteContact} onOpenChange={() => setDeleteContact(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Excluir Contato</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Tem certeza que deseja excluir <strong>{deleteContact?.name}</strong>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-rose-600 hover:bg-rose-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}