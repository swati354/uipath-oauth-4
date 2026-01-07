import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Play, MoreHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ProcessStatusBadge } from './ProcessStatusBadge';
import { StartProcessDialog } from './StartProcessDialog';
import { formatProcessDate } from '@/lib/uipath/process-utils';
import type { ProcessGetResponse } from 'uipath-sdk';
interface ProcessTableProps {
  processes: ProcessGetResponse[];
  isLoading: boolean;
  folderId?: number;
}
type SortField = 'name' | 'version' | 'lastModified' | 'status';
type SortDirection = 'asc' | 'desc';
export function ProcessTable({ processes, isLoading, folderId }: ProcessTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedProcess, setSelectedProcess] = useState<ProcessGetResponse | null>(null);
  const [showStartDialog, setShowStartDialog] = useState(false);
  // Filter and sort processes
  const filteredAndSortedProcesses = useMemo(() => {
    let filtered = processes;
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = processes.filter(process => 
        process.name?.toLowerCase().includes(query) ||
        process.key?.toLowerCase().includes(query) ||
        process.description?.toLowerCase().includes(query)
      );
    }
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';
      switch (sortField) {
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case 'version':
          aValue = a.version || '';
          bValue = b.version || '';
          break;
        case 'lastModified':
          aValue = new Date(a.lastModifiedTime || 0).getTime();
          bValue = new Date(b.lastModifiedTime || 0).getTime();
          break;
        case 'status':
          aValue = a.isActive ? 'active' : 'inactive';
          bValue = b.isActive ? 'active' : 'inactive';
          break;
        default:
          return 0;
      }
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
    return filtered;
  }, [processes, searchQuery, sortField, sortDirection]);
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  const handleStartProcess = (process: ProcessGetResponse) => {
    setSelectedProcess(process);
    setShowStartDialog(true);
  };
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortDirection === 'asc' ? 
      <ArrowUp className="h-4 w-4" /> : 
      <ArrowDown className="h-4 w-4" />;
  };
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Processes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>Processes ({filteredAndSortedProcesses.length})</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search processes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[300px]">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('name')}
                      className="h-auto p-0 font-medium hover:bg-transparent"
                    >
                      Process Name
                      {getSortIcon('name')}
                    </Button>
                  </TableHead>
                  <TableHead className="w-[120px]">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('version')}
                      className="h-auto p-0 font-medium hover:bg-transparent"
                    >
                      Version
                      {getSortIcon('version')}
                    </Button>
                  </TableHead>
                  <TableHead className="w-[120px]">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('status')}
                      className="h-auto p-0 font-medium hover:bg-transparent"
                    >
                      Status
                      {getSortIcon('status')}
                    </Button>
                  </TableHead>
                  <TableHead className="w-[180px]">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('lastModified')}
                      className="h-auto p-0 font-medium hover:bg-transparent"
                    >
                      Last Modified
                      {getSortIcon('lastModified')}
                    </Button>
                  </TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[120px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedProcesses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="text-muted-foreground">
                        {searchQuery ? 'No processes match your search criteria.' : 'No processes found.'}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedProcesses.map((process) => (
                    <TableRow key={process.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-medium text-foreground">{process.name}</div>
                          <div className="text-sm text-muted-foreground">{process.key}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{process.version}</Badge>
                      </TableCell>
                      <TableCell>
                        <ProcessStatusBadge isActive={process.isActive} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatProcessDate(process.lastModifiedTime)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[300px] truncate">
                        {process.description || 'No description available'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleStartProcess(process)}
                            disabled={!process.isActive}
                            className="h-8 px-3"
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Start
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleStartProcess(process)}>
                                <Play className="h-4 w-4 mr-2" />
                                Start Process
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {/* Start Process Dialog */}
      {selectedProcess && (
        <StartProcessDialog
          process={selectedProcess}
          folderId={folderId}
          open={showStartDialog}
          onOpenChange={setShowStartDialog}
          onSuccess={() => {
            setShowStartDialog(false);
            setSelectedProcess(null);
          }}
        />
      )}
    </>
  );
}