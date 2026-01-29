import React, { useState } from 'react';
import { api } from '@/api/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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
import { useToast } from '@/components/ui/use-toast';
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  FileText,
  Copy,
  Check,
  Loader2,
  Tag,
  Keyboard
} from 'lucide-react';

const categories = [
  { value: 'saudacao', label: 'Saudação', color: 'bg-emerald-500' },
  { value: 'despedida', label: 'Despedida', color: 'bg-blue-500' },
  { value: 'informacoes', label: 'Informações', color: 'bg-amber-500' },
  { value: 'suporte', label: 'Suporte', color: 'bg-purple-500' },
  { value: 'vendas', label: 'Vendas', color: 'bg-rose-500' },
];

export default function Templates() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [deleteTemplate, setDeleteTemplate] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    content: '',
    shortcut: '',
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: () => api.entities.Template.list('-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.entities.Template.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast({ title: 'Template criado com sucesso!' });
      closeForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.entities.Template.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast({ title: 'Template atualizado com sucesso!' });
      closeForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.entities.Template.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast({ title: 'Template excluído com sucesso!' });
      setDeleteTemplate(null);
    },
  });

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name?.toLowerCase().includes(search.toLowerCase()) ||
      template.content?.toLowerCase().includes(search.toLowerCase()) ||
      template.shortcut?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const openForm = (template = null) => {
    if (template) {
      setSelectedTemplate(template);
      setFormData({
        name: template.name || '',
        category: template.category || '',
        content: template.content || '',
        shortcut: template.shortcut || '',
      });
    } else {
      setSelectedTemplate(null);
      setFormData({ name: '', category: '', content: '', shortcut: '' });
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedTemplate(null);
    setFormData({ name: '', category: '', content: '', shortcut: '' });
  };

  const handleSave = () => {
    if (!formData.name || !formData.category || !formData.content) {
      toast({ title: 'Preencha todos os campos obrigatórios', variant: 'destructive' });
      return;
    }

    const data = { ...formData, is_active: true };
    
    if (selectedTemplate) {
      updateMutation.mutate({ id: selectedTemplate.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleCopy = (template) => {
    navigator.clipboard.writeText(template.content);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({ title: 'Conteúdo copiado!' });
  };

  const getCategoryInfo = (categoryValue) => {
    return categories.find(c => c.value === categoryValue) || { label: categoryValue, color: 'bg-slate-500' };
  };

  const groupedTemplates = filteredTemplates.reduce((acc, template) => {
    const category = template.category || 'outros';
    if (!acc[category]) acc[category] = [];
    acc[category].push(template);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Templates</h1>
          <p className="text-muted-foreground">Respostas rápidas para agilizar o atendimento</p>
        </div>
        <Button onClick={() => openForm()} className="bg-primary hover:bg-primary/90 gap-2">
          <Plus className="w-4 h-4" />
          Novo Template
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar templates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-background border-border"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48 bg-background border-border">
                <Tag className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="all">Todas Categorias</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Category Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {categories.map((cat) => {
          const count = templates.filter(t => t.category === cat.value).length;
          return (
            <Card
              key={cat.value}
              className={`bg-card border-border cursor-pointer transition-all hover:border-primary/50 ${
                categoryFilter === cat.value ? 'border-primary' : ''
              }`}
              onClick={() => setCategoryFilter(categoryFilter === cat.value ? 'all' : cat.value)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                  <div>
                    <p className="text-2xl font-bold text-foreground">{count}</p>
                    <p className="text-xs text-muted-foreground">{cat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Templates Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-card border-border">
              <CardContent className="p-4">
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-20 mb-4" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredTemplates.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">Nenhum template encontrado</p>
            <Button onClick={() => openForm()} variant="link" className="text-primary mt-2">
              Criar primeiro template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => {
            const categoryInfo = getCategoryInfo(template.category);
            return (
              <Card
                key={template.id}
                className="bg-card border-border hover:border-primary/50 transition-all group"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-foreground text-lg">{template.name}</CardTitle>
                      <Badge className={`${categoryInfo.color} text-white border-0 mt-2`}>
                        {categoryInfo.label}
                      </Badge>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopy(template)}
                        className="text-muted-foreground hover:text-foreground h-8 w-8"
                      >
                        {copiedId === template.id ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openForm(template)}
                        className="text-muted-foreground hover:text-foreground h-8 w-8"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTemplate(template)}
                        className="text-muted-foreground hover:text-rose-400 h-8 w-8"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground text-sm line-clamp-4 whitespace-pre-wrap">
                    {template.content}
                  </p>
                  {template.shortcut && (
                    <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                      <Keyboard className="w-3 h-3" />
                      <code className="bg-accent px-2 py-1 rounded">/{template.shortcut}</code>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="bg-card border-border text-foreground max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedTemplate ? 'Editar Template' : 'Novo Template'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Saudação inicial"
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label>Categoria *</Label>
              <Select
                value={formData.category}
                onValueChange={(v) => setFormData({ ...formData, category: v })}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Atalho (opcional)</Label>
              <Input
                value={formData.shortcut}
                onChange={(e) => setFormData({ ...formData, shortcut: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })}
                placeholder="Ex: ola"
                className="bg-background border-border"
              />
              <p className="text-xs text-muted-foreground">Digite /{formData.shortcut || 'atalho'} para usar rapidamente</p>
            </div>
            <div className="space-y-2">
              <Label>Conteúdo *</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Escreva o conteúdo do template..."
                className="bg-background border-border min-h-[120px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeForm}>Cancelar</Button>
            <Button
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              {(createMutation.isPending || updateMutation.isPending) ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTemplate} onOpenChange={() => setDeleteTemplate(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Excluir Template</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Tem certeza que deseja excluir o template <strong>{deleteTemplate?.name}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-background border-border text-foreground hover:bg-accent">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate(deleteTemplate.id)}
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