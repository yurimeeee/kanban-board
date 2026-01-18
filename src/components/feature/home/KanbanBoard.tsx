import { DndContext } from '@dnd-kit/core';
import { Draggable } from '@components/feature/home/Draggable';
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
