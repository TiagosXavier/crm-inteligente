import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createPageUrl } from '@/utils';
import AgentsOnlineDialog from '../components/dashboard/AgentsOnlineDialog';
import ActiveTemplatesDialog from '../components/dashboard/ActiveTemplatesDialog';
import TodayConversationsDialog from '../components/dashboard/TodayConversationsDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  UserCheck,
  FileText,
  MessageSquare,
  TrendingUp,
  Clock,
  Phone,
  Filter,
  X
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock data for charts
const conversationsData = [
  { name: 'Seg', value: 45 },
  { name: 'Ter', value: 52 },
  { name: 'Qua', value: 38 },
  { name: 'Qui', value: 65 },
  { name: 'Sex', value: 48 },
  { name: 'Sáb', value: 22 },
  { name: 'Dom', value: 15 },
];

const categoryData = [
  { name: 'Suporte', value: 35, color: '#6366f1' },
  { name: 'Vendas', value: 28, color: '#10b981' },
  { name: 'Informações', value: 22, color: '#f59e0b' },
  { name: 'Outros', value: 15, color: '#64748b' },
];

const responseTimeData = [
  { hour: '08h', avg: 2.5 },
  { hour: '10h', avg: 3.2 },
  { hour: '12h', avg: 4.1 },
  { hour: '14h', avg: 2.8 },
  { hour: '16h', avg: 3.5 },
  { hour: '18h', avg: 2.1 },
];

function StatCard({ title, value, icon: Icon, trend, color, isLoading, onClick }) {
  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-16" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={`bg-card border-border hover:border-primary/50 transition-all duration-300 group ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-emerald-500">{trend}</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl ${color} bg-opacity-20 group-hover:bg-opacity-30 transition-all`}>
            <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    agent: 'all',
    chartType: 'area'
  });
  const [activeFilters, setActiveFilters] = useState({
    dateFrom: '',
    dateTo: '',
    agent: 'all',
    chartType: 'area'
  });
  const [showAgentsDialog, setShowAgentsDialog] = useState(false);
  const [showTemplatesDialog, setShowTemplatesDialog] = useState(false);
  const [showConversationsDialog, setShowConversationsDialog] = useState(false);

  const { data: contacts = [], isLoading: contactsLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => base44.entities.Contact.list('-created_date', 100),
  });

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list(),
  });

  const { data: templates = [], isLoading: templatesLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: () => base44.entities.Template.list(),
  });

  const applyFilters = () => {
    setActiveFilters({ ...filters });
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      agent: 'all',
      chartType: 'area'
    });
    setActiveFilters({
      dateFrom: '',
      dateTo: '',
      agent: 'all',
      chartType: 'area'
    });
  };

  // Apply filters to contacts
  const filteredContacts = contacts.filter(contact => {
    if (contact.created_date) {
      const contactDate = new Date(contact.created_date);
      
      if (activeFilters.dateFrom) {
        const fromDate = new Date(activeFilters.dateFrom);
        if (contactDate < fromDate) return false;
      }
      
      if (activeFilters.dateTo) {
        const toDate = new Date(activeFilters.dateTo);
        toDate.setHours(23, 59, 59, 999);
        if (contactDate > toDate) return false;
      }
    }
    
    if (activeFilters.agent !== 'all' && contact.assigned_to !== activeFilters.agent) {
      return false;
    }
    return true;
  });

  const activeUsers = users.filter(u => u.status === 'online' && u.is_active !== false);
  const recentContacts = filteredContacts.slice(0, 5);
  const isLoading = contactsLoading || usersLoading || templatesLoading;

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getStatusColor = (status) => {
    const colors = {
      novo: 'bg-blue-500',
      em_atendimento: 'bg-amber-500',
      aguardando: 'bg-purple-500',
      resolvido: 'bg-emerald-500',
      escalado: 'bg-rose-500',
    };
    return colors[status] || 'bg-slate-500';
  };

  const getStatusLabel = (status) => {
    const labels = {
      novo: 'Novo',
      em_atendimento: 'Em Atendimento',
      aguardando: 'Aguardando',
      resolvido: 'Resolvido',
      escalado: 'Escalado',
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do seu CRM</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Clock className="w-4 h-4" />
          {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground text-sm">Data Início</Label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground text-sm">Data Término</Label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground text-sm">Agente</Label>
                <Select value={filters.agent} onValueChange={(v) => setFilters({ ...filters, agent: v })}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="all">Todos os Agentes</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.email}>
                        {user.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground text-sm">Tipo de Gráfico</Label>
                <Select value={filters.chartType} onValueChange={(v) => setFilters({ ...filters, chartType: v })}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="area">Área</SelectItem>
                    <SelectItem value="bar">Barras</SelectItem>
                    <SelectItem value="line">Linha</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                onClick={applyFilters}
                className="bg-primary hover:bg-primary/90 gap-2"
              >
                <Filter className="w-4 h-4" />
                Filtrar
              </Button>
              <Button
                onClick={clearFilters}
                variant="outline"
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Limpar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Contatos"
          value={filteredContacts.length}
          icon={Users}
          trend="+12% este mês"
          color="bg-indigo-500"
          isLoading={isLoading}
          onClick={() => navigate(createPageUrl('Contacts'))}
        />
        <StatCard
          title="Agentes Online"
          value={activeUsers.length}
          icon={UserCheck}
          color="bg-emerald-500"
          isLoading={isLoading}
          onClick={() => setShowAgentsDialog(true)}
        />
        <StatCard
          title="Templates Ativos"
          value={templates.filter(t => t.is_active !== false).length}
          icon={FileText}
          color="bg-amber-500"
          isLoading={isLoading}
          onClick={() => setShowTemplatesDialog(true)}
        />
        <StatCard
          title="Conversas Hoje"
          value={filteredContacts.filter(c => c.created_date && new Date(c.created_date).toDateString() === new Date().toDateString()).length}
          icon={MessageSquare}
          trend="+8% vs ontem"
          color="bg-purple-500"
          isLoading={isLoading}
          onClick={() => setShowConversationsDialog(true)}
        />
      </div>

      {/* Dialogs */}
      <AgentsOnlineDialog 
        open={showAgentsDialog} 
        onOpenChange={setShowAgentsDialog}
        users={users}
      />
      <ActiveTemplatesDialog 
        open={showTemplatesDialog} 
        onOpenChange={setShowTemplatesDialog}
        templates={templates}
      />
      <TodayConversationsDialog 
        open={showConversationsDialog} 
        onOpenChange={setShowConversationsDialog}
        contacts={filteredContacts}
      />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversations Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-lg">Conversas por Dia</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              {activeFilters.chartType === 'area' ? (
                <AreaChart data={conversationsData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                  />
                  </AreaChart>
                  ) : activeFilters.chartType === 'bar' ? (
                  <BarChart data={conversationsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                  ) : (
                  <AreaChart data={conversationsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="none"
                  />
                  </AreaChart>
                  )}
                  </ResponsiveContainer>
                  </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-lg">Distribuição por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Contacts */}
        <Card className="bg-card border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-foreground text-lg">Últimos Contatos</CardTitle>
          </CardHeader>
          <CardContent>
            {contactsLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentContacts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Nenhum contato cadastrado ainda</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {getInitials(contact.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground font-medium truncate">{contact.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        {contact.phone}
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(contact.status)} text-white border-0`}>
                      {getStatusLabel(contact.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Response Time */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-lg">Tempo de Resposta (min)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="hour" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="avg" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}