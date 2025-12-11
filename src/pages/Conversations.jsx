import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Search,
  Phone,
  Mail,
  Building2,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  MessageSquare,
  Circle,
  CheckCheck,
  Clock,
  Tag
} from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock messages for demo
const mockMessages = [
  { id: 1, content: 'Olá! Preciso de ajuda com meu pedido.', fromUser: true, time: '09:30' },
  { id: 2, content: 'Olá! Claro, posso ajudar. Qual é o número do seu pedido?', fromUser: false, time: '09:31' },
  { id: 3, content: 'É o pedido #12345', fromUser: true, time: '09:32' },
  { id: 4, content: 'Encontrei seu pedido! Ele está em processamento e deve ser enviado amanhã. Posso ajudar com mais alguma coisa?', fromUser: false, time: '09:33' },
  { id: 5, content: 'Perfeito! Obrigado pela ajuda rápida!', fromUser: true, time: '09:35' },
];

export default function Conversations() {
  const [search, setSearch] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [message, setMessage] = useState('');

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => base44.entities.Contact.list('-created_date'),
  });

  const filteredContacts = contacts.filter((contact) =>
    contact.name?.toLowerCase().includes(search.toLowerCase()) ||
    contact.phone?.includes(search)
  );

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    if (isToday(d)) return 'Hoje';
    if (isYesterday(d)) return 'Ontem';
    return format(d, 'dd/MM', { locale: ptBR });
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

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    // In real implementation, this would send the message
    setMessage('');
  };

  return (
    <div className="flex gap-4" style={{ height: 'calc(100vh - 120px)' }}>
      {/* Contacts List */}
      <Card className="bg-card border-border w-80 flex-shrink-0 flex flex-col">
        <div className="p-4 border-b border-border flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar conversas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-background border-border"
            />
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="w-10 h-10 mx-auto mb-2 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground text-sm">Nenhuma conversa encontrada</p>
            </div>
          ) : (
            <div className="p-2">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                    selectedContact?.id === contact.id
                      ? 'bg-primary/20 border border-primary/30'
                      : 'hover:bg-accent'
                  }`}
                >
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(contact.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${getStatusColor(contact.status)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-medium text-foreground truncate flex-1">{contact.name}</h3>
                      <span className="text-xs text-muted-foreground flex-shrink-0">{formatDate(contact.created_date)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">Última mensagem do contato...</p>
                  </div>
                  {Math.random() > 0.5 && (
                    <span className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground font-bold">
                      {Math.floor(Math.random() * 5) + 1}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </Card>

      {/* Chat Area */}
      {selectedContact ? (
        <Card className="bg-card border-border flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(selectedContact.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-foreground">{selectedContact.name}</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Circle className={`w-2 h-2 ${getStatusColor(selectedContact.status)}`} />
                  <span>Online</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-xs text-muted-foreground bg-accent px-3 py-1 rounded-full">
                  Hoje
                </span>
              </div>
              
              {mockMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.fromUser ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-2xl ${
                      msg.fromUser
                        ? 'bg-accent text-foreground rounded-bl-none'
                        : 'bg-primary text-primary-foreground rounded-br-none'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <div className={`flex items-center justify-end gap-1 mt-1 ${msg.fromUser ? 'text-muted-foreground' : 'text-primary-foreground/70'}`}>
                      <span className="text-xs">{msg.time}</span>
                      {!msg.fromUser && <CheckCheck className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Paperclip className="w-5 h-5" />
              </Button>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-background border-border"
              />
              <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Smile className="w-5 h-5" />
              </Button>
              <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <Card className="bg-card border-border flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Selecione uma conversa</h2>
            <p className="text-muted-foreground">Escolha um contato para iniciar o atendimento</p>
          </div>
        </Card>
      )}

      {/* Contact Details Sidebar */}
      {selectedContact && (
        <Card className="bg-card border-border w-72 flex-shrink-0 hidden lg:block">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <Avatar className="w-20 h-20 mx-auto mb-3">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {getInitials(selectedContact.name)}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-foreground text-lg">{selectedContact.name}</h3>
              <Badge className={`${getStatusColor(selectedContact.status)} text-white border-0 mt-2`}>
                {selectedContact.status?.replace('_', ' ')}
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-accent rounded-lg">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{selectedContact.phone}</span>
              </div>
              
              {selectedContact.email && (
                <div className="flex items-center gap-3 p-3 bg-accent rounded-lg">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground truncate">{selectedContact.email}</span>
                </div>
              )}
              
              {selectedContact.company && (
                <div className="flex items-center gap-3 p-3 bg-accent rounded-lg">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{selectedContact.company}</span>
                </div>
              )}

              {selectedContact.tags?.length > 0 && (
                <div className="p-3 bg-accent rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedContact.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-secondary text-secondary-foreground text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedContact.notes && (
                <div className="p-3 bg-accent rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Observações</p>
                  <p className="text-sm text-foreground">{selectedContact.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}