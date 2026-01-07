import React, { useState } from 'react';
import { Play, Loader2, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useStartProcess } from '@/hooks/useUiPathProcesses';
import type { ProcessGetResponse } from 'uipath-sdk';
interface StartProcessDialogProps {
  process: ProcessGetResponse;
  folderId?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}
export function StartProcessDialog({
  process,
  folderId,
  open,
  onOpenChange,
  onSuccess
}: StartProcessDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const startProcessMutation = useStartProcess();
  const handleStartProcess = async () => {
    if (!process.key) {
      setError('Process key is missing');
      return;
    }
    if (!folderId) {
      setError('Folder ID is required to start process');
      return;
    }
    try {
      setError(null);
      await startProcessMutation.mutateAsync({
        processKey: process.key,
        folderId: folderId
      });
      onSuccess?.();
    } catch (err) {
      console.error('Failed to start process:', err);
      setError(err instanceof Error ? err.message : 'Failed to start process');
    }
  };
  const handleClose = () => {
    setError(null);
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-primary" />
            Start Process
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to start this process?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Process Information */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3 border">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Process Name:</span>
              <p className="text-sm font-medium text-foreground">{process.name}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Version:</span>
              <p className="text-sm text-foreground">{process.processVersion}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Key:</span>
              <p className="text-sm text-foreground font-mono">{process.key}</p>
            </div>
            {process.description && (
              <div>
                <span className="text-sm font-medium text-muted-foreground">Description:</span>
                <p className="text-sm text-foreground">{process.description}</p>
              </div>
            )}
          </div>
          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {/* Warning for outdated processes */}
          {!process.isLatestVersion && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This process is not the latest version. Consider updating to the latest version before execution.
              </AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={startProcessMutation.isPending}
            className="transition-all duration-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleStartProcess}
            disabled={startProcessMutation.isPending}
            className="min-w-[100px] transition-all duration-200"
          >
            {startProcessMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Starting...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Process
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}