import { DndContext } from '@dnd-kit/core';
import { Draggable } from '@components/feature/home/Draggable';
import { Droppable } from '@components/feature/home/Droppable';
import React from 'react';
import styled from '@emotion/styled';

const Wrap = styled.div`
  width: 100%;
  background: white;
  /* height: ; */
`;
const KanbanBoard = () => {
  return (
    <Wrap>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Project Board</h1>
        <p className="text-sm text-gray-600 mt-1">Manage your tasks and workflow</p>
      </div>
      <DndContext>
        <Draggable children={<div></div>} />
        <Droppable children={<div></div>} />
      </DndContext>
      <div className="flex justify-between gap-6 items-start">
        <div>
          <p className="text-sm"></p>
        </div>
      </div>
    </Wrap>
  );
};

export default KanbanBoard;
