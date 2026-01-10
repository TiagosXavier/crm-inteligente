import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MetricsCard({ title, value, icon: Icon, trend, trendValue, color, isLoading, onClick, subtitle }) {
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

  const isPositiveTrend = trend === 'up';

  return (
    <Card 
      className={`bg-card border-border hover:border-primary/50 transition-all duration-300 group ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
            {trendValue && (
              <div className={`flex items-center gap-1 mt-2 ${isPositiveTrend ? 'text-emerald-500' : 'text-rose-500'}`}>
                {isPositiveTrend ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">{trendValue}</span>
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