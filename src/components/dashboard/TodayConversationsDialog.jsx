import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Phone, Mail } from 'lucide-react';
import { format, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusColors = {
  novo: 'bg-blue-500',
  em_atendimento: 'bg-amber-500',
  aguardando: 'bg-purple-500',
  resolvido: 'bg-emerald-500',
  escalado: 'bg-rose-500',
};

const statusLabels = {
  novo: 'Novo',
  em_atendimento: 'Em Atendimento',
  aguardando: 'Aguardando',
  resolvido: 'Resolvido',
  escalado: 'Escalado',
};

export default function TodayConversationsDialog({ open, onOpenChange, contacts }) {
  const todayContacts = contacts.filter(c => 
    c.created_date && isToday(new Date(c.created_date))
  );

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border text-foreground max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-500" />
            Conversas de Hoje
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[500px] pr-4">
          {todayContacts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma conversa iniciada hoje</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayContacts.map((contact) => (
                <Card key={contact.id} className="bg-accent/30 border-border hover:border-primary/50 transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-12 h-12 flex-shrink-0">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(contact.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h4 className="font-medium text-foreground truncate">{contact.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              <span>{contact.phone}</span>
                            </div>
                            {contact.email && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                <Mail className="w-3 h-3" />
                                <span className="truncate">{contact.email}</span>
                              </div>
                            )}
                          </div>
                          <Badge className={`${statusColors[contact.status]} text-white border-0 flex-shrink-0`}>
                            {statusLabels[contact.status] || contact.status}
                          </Badge>
                        </div>
                        {contact.notes && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                            {contact.notes}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span>
                            {format(new Date(contact.created_date), "HH:mm", { locale: ptBR })}
                          </span>
                          {contact.assigned_to && (
                            <>
                              <span>•</span>
                              <span>Atendente: {contact.assigned_to.split('@')[0]}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}