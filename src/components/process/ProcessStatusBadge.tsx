import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
interface ProcessStatusBadgeProps {
  isLatestVersion: boolean;
}
export function ProcessStatusBadge({ isLatestVersion }: ProcessStatusBadgeProps) {
  if (isLatestVersion) {
    return (
      <Badge 
        variant="outline" 
        className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 transition-colors"
      >
        <CheckCircle className="h-3 w-3 mr-1" />
        Latest
      </Badge>
    );
  }
  return (
    <Badge 
      variant="outline" 
      className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 transition-colors"
    >
      <Clock className="h-3 w-3 mr-1" />
      Outdated
    </Badge>
  );
}