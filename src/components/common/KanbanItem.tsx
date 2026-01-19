import React from 'react';

type Tag = {
  text: string;
  type?: string;
  color?: string;
  bgColor?: string;
  size: string;
};
type KanbanItemProps = {
  width?: string;
  maxWidth?: string;
  maxHeight?: string;
  disabled?: boolean;
  type: string;
  priority?: string;
  period: string;
  tag: string;
};
const KanbanItem = ({}: KanbanItemProps) => {
  return <div className=""></div>;
};

export default KanbanItem;
