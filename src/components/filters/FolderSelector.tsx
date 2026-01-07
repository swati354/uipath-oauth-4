import React from 'react';
import { Folder, ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
interface FolderSelectorProps {
  selectedFolderId?: number;
  onFolderChange: (folderId: number | undefined) => void;
}
export function FolderSelector({ selectedFolderId, onFolderChange }: FolderSelectorProps) {
  // For now, we'll use a simple folder selector
  // In a real implementation, this would fetch folders from the UiPath API
  const folders = [
    { id: undefined, name: 'All Folders' },
    { id: 1, name: 'Default' },
    { id: 2, name: 'Production' },
    { id: 3, name: 'Development' },
    { id: 4, name: 'Testing' }
  ];
  const handleValueChange = (value: string) => {
    if (value === 'all') {
      onFolderChange(undefined);
    } else {
      onFolderChange(parseInt(value, 10));
    }
  };
  const currentValue = selectedFolderId ? selectedFolderId.toString() : 'all';
  return (
    <div className="flex items-center space-x-2">
      <Folder className="h-4 w-4 text-muted-foreground" />
      <Select value={currentValue} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select folder" />
        </SelectTrigger>
        <SelectContent>
          {folders.map((folder) => (
            <SelectItem 
              key={folder.id || 'all'} 
              value={folder.id ? folder.id.toString() : 'all'}
            >
              {folder.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}