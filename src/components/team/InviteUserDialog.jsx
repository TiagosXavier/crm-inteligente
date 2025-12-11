import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Mail, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function InviteUserDialog({ open, onOpenChange }) {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    role: 'user',
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const inviteMutation = useMutation({
    mutationFn: async (data) => {
      // Send email invitation
      await base44.integrations.Core.SendEmail({
        to: data.email,
        subject: 'Convite para CRM Smart',
        from_name: 'CRM Smart',
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #6366f1;">Bem-vindo ao CRM Smart!</h1>
            <p>Olá ${data.full_name},</p>
            <p>Você foi convidado para fazer parte da equipe no CRM Smart.</p>
            <p>Seu perfil foi configurado como: <strong>${getRoleLabel(data.role)}</strong></p>
            <p>Para começar, acesse a plataforma e faça login com este email.</p>
            <div style="margin: 30px 0; text-align: center;">
              <a href="${window.location.origin}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
                Acessar CRM Smart
              </a>
            </div>
            <p style="color: #64748b; font-size: 14px;">Se você não esperava este convite, por favor ignore este email.</p>
          </div>
        `,
      });

      // Create notification for the new user
      await base44.entities.Notification.create({
        title: 'Bem-vindo ao CRM Smart!',
        message: `Você foi convidado para a equipe como ${getRoleLabel(data.role)}`,
        type: 'success',
        user_email: data.email,
      });

      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Convite enviado!',
        description: 'O usuário receberá um email com instruções.',
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      resetForm();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: 'Erro ao enviar convite',
        description: error.message || 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    },
  });

  const getRoleLabel = (role) => {
    const labels = {
      admin: 'Administrador',
      supervisor: 'Supervisor',
      user: 'Atendente',
    };
    return labels[role] || role;
  };

  const resetForm = () => {
    setFormData({
      email: '',
      full_name: '',
      role: 'user',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.full_name) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha nome e email.',
        variant: 'destructive',
      });
      return;
    }
    inviteMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Convidar Novo Usuário
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Envie um convite por email para adicionar um novo membro à equipe.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nome Completo *</Label>
              <Input
                id="full_name"
                placeholder="João Silva"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="bg-background border-border"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="joao@exemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-background border-border"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Cargo</Label>
              <Select
                value={formData.role}
                onValueChange={(v) => setFormData({ ...formData, role: v })}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="user">Atendente</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                O usuário poderá fazer login com o email fornecido.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
              disabled={inviteMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={inviteMutation.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              {inviteMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Enviar Convite
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}