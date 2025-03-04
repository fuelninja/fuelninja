
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StatusFilterTabsProps {
  totalCount: number;
  pendingCount: number;
  inProgressCount: number;
  deliveredCount: number;
  onFilterChange: (value: string) => void;
}

const StatusFilterTabs: React.FC<StatusFilterTabsProps> = ({ 
  totalCount, 
  pendingCount, 
  inProgressCount, 
  deliveredCount, 
  onFilterChange 
}) => {
  return (
    <Tabs defaultValue="all" onValueChange={onFilterChange}>
      <TabsList>
        <TabsTrigger value="all">All ({totalCount})</TabsTrigger>
        <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
        <TabsTrigger value="in_progress">In Progress ({inProgressCount})</TabsTrigger>
        <TabsTrigger value="delivered">Delivered ({deliveredCount})</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default StatusFilterTabs;
