import React from 'react';
import { Activity, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { ProcessGetResponse } from 'uipath-sdk';
interface ProcessMetricsCardsProps {
  processes: ProcessGetResponse[];
  isLoading: boolean;
}
export function ProcessMetricsCards({ processes, isLoading }: ProcessMetricsCardsProps) {
  const metrics = React.useMemo(() => {
    if (!processes.length) {
      return {
        total: 0,
        active: 0,
        inactive: 0,
        recentlyModified: 0
      };
    }
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    return {
      total: processes.length,
      active: processes.filter(p => p.isActive).length,
      inactive: processes.filter(p => !p.isActive).length,
      recentlyModified: processes.filter(p => 
        p.lastModifiedTime && new Date(p.lastModifiedTime) > oneDayAgo
      ).length
    };
  }, [processes]);
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  const metricCards = [
    {
      title: 'Total Processes',
      value: metrics.total,
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'All available processes'
    },
    {
      title: 'Active Processes',
      value: metrics.active,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Ready to execute'
    },
    {
      title: 'Inactive Processes',
      value: metrics.inactive,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: 'Not available for execution'
    },
    {
      title: 'Recently Modified',
      value: metrics.recentlyModified,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Updated in last 24 hours'
    }
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricCards.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`h-6 w-6 ${metric.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {metric.value}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {metric.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}