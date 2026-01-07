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
    if (!processes?.length) {
      return {
        total: 0,
        latest: 0,
        outdated: 0,
        recentlyModified: 0
      };
    }
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    return {
      total: processes.length,
      latest: processes.filter(p => p.isLatestVersion).length,
      outdated: processes.filter(p => !p.isLatestVersion).length,
      recentlyModified: processes.filter(p =>
        p.lastModifiedTime && new Date(p.lastModifiedTime) > oneDayAgo
      ).length
    };
  }, [processes]);
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
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
      title: 'Latest Version',
      value: metrics.latest,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Up-to-date processes'
    },
    {
      title: 'Outdated',
      value: metrics.outdated,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: 'Older versions available'
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
          <Card 
            key={metric.title} 
            className="hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer"
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${metric.bgColor} transition-all duration-200`}>
                  <Icon className={`h-6 w-6 ${metric.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold text-foreground transition-colors">
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