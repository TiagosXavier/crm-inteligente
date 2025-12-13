import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const categoryColors = {
  saudacao: 'bg-blue-500',
  despedida: 'bg-purple-500',
  informacoes: 'bg-amber-500',
  suporte: 'bg-emerald-500',
  vendas: 'bg-rose-500',
};

const categoryLabels = {
  saudacao: 'Saudação',
  despedida: 'Despedida',
  informacoes: 'Informações',
  suporte: 'Suporte',
  vendas: 'Vendas',
};

export default function ActiveTemplatesDialog({ open, onOpenChange, templates }) {
  const [copiedId, setCopiedId] = React.useState(null);
  const activeTemplates = templates.filter(t => t.is_active !== false);

  const handleCopy = (content, id) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border text-foreground max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            Templates Ativos
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[500px] pr-4">
          {activeTemplates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum template ativo</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeTemplates.map((template) => (
                <Card key={template.id} className="bg-accent/30 border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-foreground">{template.name}</h4>
                          {template.shortcut && (
                            <Badge variant="outline" className="text-xs">
                              {template.shortcut}
                            </Badge>
                          )}
                        </div>
                        <Badge className={`${categoryColors[template.category]} text-white border-0 text-xs`}>
                          {categoryLabels[template.category] || template.category}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopy(template.content, template.id)}
                        className="flex-shrink-0"
                      >
                        {copiedId === template.id ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                      {template.content}
                    </p>
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