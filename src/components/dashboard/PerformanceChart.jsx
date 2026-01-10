import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function PerformanceChart({ users, contacts }) {
  const getUserPerformance = () => {
    return users.map(user => {
      const userContacts = contacts.filter(c => c.assigned_to === user.email);
      const resolved = userContacts.filter(c => c.status === 'resolvido').length;
      const inProgress = userContacts.filter(c => c.status === 'em_atendimento').length;
      const pending = userContacts.filter(c => c.status === 'aguardando').length;

      return {
        name: user.full_name?.split(' ')[0] || user.email.split('@')[0],
        resolvidos: resolved,
        'em andamento': inProgress,
        aguardando: pending,
        total: userContacts.length,
      };
    }).filter(u => u.total > 0).slice(0, 6);
  };

  const data = getUserPerformance();

  if (data.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-lg">Performance da Equipe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p>Nenhum dado de performance disponível</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground text-lg">Performance da Equipe</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="name" 
              stroke="#64748b" 
              tick={{ fill: '#94a3b8' }}
            />
            <YAxis 
              stroke="#64748b" 
              tick={{ fill: '#94a3b8' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Legend 
              wrapperStyle={{ color: '#94a3b8' }}
            />
            <Bar dataKey="resolvidos" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="em andamento" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="aguardando" fill="#a855f7" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}