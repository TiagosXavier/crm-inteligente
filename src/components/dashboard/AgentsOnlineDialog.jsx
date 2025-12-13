import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Circle, UserCheck } from 'lucide-react';

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

export default function AgentsOnlineDialog({ open, onOpenChange, users }) {
  const onlineUsers = users.filter(u => u.status === 'online' && u.is_active !== false);

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border text-foreground max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-500" />
            Agentes Online
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[400px] pr-4">
          {onlineUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <UserCheck className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum agente online no momento</p>
            </div>
          ) : (
            <div className="space-y-3">
              {onlineUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
                >
                  <div className="relative">
                    <Avatar className="w-12 h-12 border-2 border-border">
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(user.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${statusColors[user.status || 'offline']}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{user.full_name}</p>
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="outline" className="border-emerald-500 text-emerald-500">
                      <Circle className="w-2 h-2 mr-1 fill-current" />
                      {statusLabels[user.status || 'offline']}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {roleLabels[user.role] || user.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}