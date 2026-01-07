import React from 'react';
import { Activity, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FolderSelector } from '@/components/filters/FolderSelector';
interface HeaderProps {
  selectedFolderId?: number;
  onFolderChange: (folderId: number | undefined) => void;
}
export function Header({ selectedFolderId, onFolderChange }: HeaderProps) {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary rounded-lg">
                <Activity className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  UiPath Process Manager
                </h1>
                <p className="text-sm text-muted-foreground">
                  Orchestrator Dashboard
                </p>
              </div>
            </div>
          </div>
          {/* Controls */}
          <div className="flex items-center space-x-4">
            <FolderSelector
              selectedFolderId={selectedFolderId}
              onFolderChange={onFolderChange}
            />
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}