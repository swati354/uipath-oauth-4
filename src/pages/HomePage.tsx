import React, { useEffect, useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { initializeUiPathSDK } from '@/lib/uipath';
import { Header } from '@/components/layout/Header';
import { ProcessMetricsCards } from '@/components/process/ProcessMetricsCards';
import { ProcessTable } from '@/components/process/ProcessTable';
import { useUiPathProcesses } from '@/hooks/useUiPathProcesses';
export function HomePage() {
  const [isSDKInitialized, setIsSDKInitialized] = useState(false);
  const [sdkError, setSDKError] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<number | undefined>(undefined);
  // Initialize UiPath SDK on component mount
  useEffect(() => {
    const initSDK = async () => {
      try {
        console.log('🚀 Initializing UiPath SDK...');
        await initializeUiPathSDK();
        setIsSDKInitialized(true);
        setSDKError(null);
        console.log('✅ UiPath SDK initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize UiPath SDK:', error);
        setSDKError(error instanceof Error ? error.message : 'Failed to initialize UiPath SDK');
        setIsSDKInitialized(false);
      }
    };
    initSDK();
  }, []);
  // Fetch processes data
  const { 
    data: processes, 
    isLoading: processesLoading, 
    error: processesError 
  } = useUiPathProcesses(selectedFolderId, isSDKInitialized);
  // Handle SDK initialization error
  if (sdkError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to initialize UiPath connection: {sdkError}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }
  // Show loading state during SDK initialization
  if (!isSDKInitialized) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground">Connecting to UiPath Orchestrator...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background">
      <Header 
        selectedFolderId={selectedFolderId}
        onFolderChange={setSelectedFolderId}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-8">
          {/* Metrics Section */}
          <ProcessMetricsCards 
            processes={processes || []}
            isLoading={processesLoading}
          />
          {/* Process Table Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Process Management</h2>
              <p className="text-muted-foreground">
                View and manage all automation processes in your organization
              </p>
            </div>
            {processesError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load processes: {processesError.message}
                </AlertDescription>
              </Alert>
            ) : (
              <ProcessTable 
                processes={processes || []}
                isLoading={processesLoading}
                folderId={selectedFolderId}
              />
            )}
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-muted-foreground">
            © Powered by UiPath
          </p>
        </div>
      </footer>
    </div>
  );
}