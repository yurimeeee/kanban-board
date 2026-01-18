import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';

import KanbanBoard from '@components/feature/home/KanbanBoard';
import React from 'react';

const Main = () => {
  return (
    <div>
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="kanban">KANBAN</TabsTrigger>
          <TabsTrigger value="calendar">CALENAR</TabsTrigger>
          <TabsTrigger value="table">TABLE LIST</TabsTrigger>
        </TabsList>
        <TabsContent value="kanban">
          <KanbanBoard />
        </TabsContent>
        <TabsContent value="calendar">Change your password here.</TabsContent>
        <TabsContent value="table">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
};

export default Main;
