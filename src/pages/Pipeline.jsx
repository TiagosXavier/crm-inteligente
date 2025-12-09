import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import {
  DragDropContext,
  Droppable,
  Draggable,
} from '@hello-pangea/dnd';
import {
  Phone,
  Mail,
  Building2,
  Clock,
  GripVertical,
  Users,
  Plus
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const stages = [
  { id: 'novo', title: 'Novo', color: 'bg-blue-500', borderColor: 'border-blue-500' },
  { id: 'em_atendimento', title: 'Em Atendimento', color: 'bg-amber-500', borderColor: 'border-amber-500' },
  { id: 'aguardando', title: 'Aguardando', color: 'bg-purple-500', borderColor: 'border-purple-500' },
  { id: 'resolvido', title: 'Resolvido', color: 'bg-emerald-500', borderColor: 'border-emerald-500' },
  { id: 'escalado', title: 'Escalado', color: 'bg-rose-500', borderColor: 'border-rose-500' },
];

export default function Pipeline() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => base44.entities.Contact.list('-created_date'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Contact.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });

  const getContactsByStatus = (status) => {
    return contacts.filter((c) => c.status === status);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;
    
    const contact = contacts.find(c => c.id === draggableId);
    if (contact && contact.status !== newStatus) {
      updateMutation.mutate({
        id: draggableId,
        data: { status: newStatus }
      });
      
      const stageInfo = stages.find(s => s.id === newStatus);
      toast({ title: `${contact.name} movido para ${stageInfo?.title}` });
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Pipeline</h1>
          <p className="text-slate-400">Acompanhe o funil de atendimento</p>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => (
            <div key={stage.id} className="flex-shrink-0 w-72">
              <Skeleton className="h-8 w-full mb-4" />
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Pipeline</h1>
          <p className="text-slate-400">Acompanhe o funil de atendimento</p>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{contacts.length} contatos no funil</span>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-14rem)]">
          {stages.map((stage) => {
            const stageContacts = getContactsByStatus(stage.id);
            
            return (
              <div key={stage.id} className="flex-shrink-0 w-72">
                {/* Column Header */}
                <div className={`flex items-center justify-between p-3 rounded-lg bg-card border-l-4 ${stage.borderColor} mb-4`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${stage.color}`} />
                    <h3 className="font-semibold text-foreground">{stage.title}</h3>
                  </div>
                  <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                    {stageContacts.length}
                  </Badge>
                </div>

                {/* Column Content */}
                <Droppable droppableId={stage.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-3 min-h-[200px] p-2 rounded-lg transition-colors ${
                        snapshot.isDraggingOver ? 'bg-accent/50' : ''
                      }`}
                    >
                      {stageContacts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <div className={`w-12 h-12 rounded-full ${stage.color} bg-opacity-20 flex items-center justify-center mb-3`}>
                            <Users className={`w-6 h-6 ${stage.color.replace('bg-', 'text-')}`} />
                          </div>
                          <p className="text-muted-foreground text-sm">Nenhum contato</p>
                        </div>
                      ) : (
                        stageContacts.map((contact, index) => (
                          <Draggable
                            key={contact.id}
                            draggableId={contact.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`bg-card border-border hover:border-primary/50 transition-all cursor-pointer ${
                                  snapshot.isDragging ? 'shadow-xl shadow-primary/20 border-primary' : ''
                                }`}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start gap-3">
                                    <div
                                      {...provided.dragHandleProps}
                                      className="mt-1 text-muted-foreground hover:text-foreground cursor-grab"
                                    >
                                      <GripVertical className="w-4 h-4" />
                                    </div>
                                    <Avatar className="w-10 h-10 flex-shrink-0">
                                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                                        {getInitials(contact.name)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-medium text-foreground truncate">
                                        {contact.name}
                                      </h4>
                                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                        <Phone className="w-3 h-3" />
                                        <span>{contact.phone}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {(contact.company || contact.email) && (
                                    <div className="mt-3 pt-3 border-t border-border space-y-1">
                                      {contact.company && (
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                          <Building2 className="w-3 h-3" />
                                          <span className="truncate">{contact.company}</span>
                                        </div>
                                      )}
                                      {contact.email && (
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                          <Mail className="w-3 h-3" />
                                          <span className="truncate">{contact.email}</span>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {contact.tags?.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-3">
                                      {contact.tags.slice(0, 2).map((tag) => (
                                        <Badge
                                          key={tag}
                                          variant="secondary"
                                          className="bg-secondary text-secondary-foreground text-xs"
                                        >
                                          {tag}
                                        </Badge>
                                      ))}
                                      {contact.tags.length > 2 && (
                                        <Badge variant="secondary" className="bg-secondary text-secondary-foreground text-xs">
                                          +{contact.tags.length - 2}
                                        </Badge>
                                      )}
                                    </div>
                                  )}

                                  <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    <span>
                                      {contact.created_date
                                        ? format(new Date(contact.created_date), "dd/MM/yyyy", { locale: ptBR })
                                        : 'Sem data'}
                                    </span>
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}