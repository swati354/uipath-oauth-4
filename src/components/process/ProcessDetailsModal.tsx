import React from 'react';
import { X, Calendar, Key, FileText, Settings, Activity } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ProcessStatusBadge } from './ProcessStatusBadge';
import { formatProcessDate } from '@/lib/uipath/process-utils';
import type { ProcessGetResponse } from 'uipath-sdk';
interface ProcessDetailsModalProps {
  process: ProcessGetResponse;
  folderId?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function ProcessDetailsModal({
  process,
  folderId,
  open,
  onOpenChange
}: ProcessDetailsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Process Details
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-auto">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="configuration">Configuration</TabsTrigger>
              <TabsTrigger value="parameters">Parameters</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Process Name</label>
                      <p className="text-sm font-medium text-foreground mt-1">{process.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Status</label>
                      <div className="mt-1">
                        <ProcessStatusBadge isLatestVersion={process.isLatestVersion} />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Process Key</label>
                      <p className="text-sm font-mono text-foreground mt-1 bg-muted/50 px-2 py-1 rounded">
                        {process.key}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Version</label>
                      <div className="mt-1">
                        <Badge variant="outline">{process.processVersion}</Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Created</label>
                      <p className="text-sm text-foreground mt-1">
                        {formatProcessDate(process.creationTime)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Last Modified</label>
                      <p className="text-sm text-foreground mt-1">
                        {formatProcessDate(process.lastModifiedTime)}
                      </p>
                    </div>
                  </div>
                  {process.description && (
                    <>
                      <Separator />
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Description</label>
                        <p className="text-sm text-foreground mt-1 leading-relaxed">
                          {process.description}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
              {/* Additional Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Technical Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Process ID</label>
                      <p className="text-sm font-mono text-foreground mt-1">{process.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Latest Version</label>
                      <p className="text-sm text-foreground mt-1">
                        {process.isLatestVersion ? 'Yes' : 'No'}
                      </p>
                    </div>
                    {process.packageId && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Package ID</label>
                        <p className="text-sm font-mono text-foreground mt-1">{process.packageId}</p>
                      </div>
                    )}
                    {process.entryPoint && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Entry Point</label>
                        <p className="text-sm text-foreground mt-1">{process.entryPoint}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="configuration" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Process Configuration</CardTitle>
                  <CardDescription>
                    Configuration settings and properties for this process
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Configuration details will be displayed here</p>
                    <p className="text-sm">This feature requires additional API endpoints</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="parameters" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Input Parameters</CardTitle>
                  <CardDescription>
                    Parameters that can be passed when starting this process
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Process parameters will be displayed here</p>
                    <p className="text-sm">This feature requires additional API endpoints</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="history" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Execution History</CardTitle>
                  <CardDescription>
                    Recent executions and their status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Execution history will be displayed here</p>
                    <p className="text-sm">This feature requires additional API endpoints</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}