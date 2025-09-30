// =============================================================
// File: components/elements/RectangleElement.tsx
// =============================================================
import React from 'react';
import { Rect } from 'react-konva';
import type { PermisElement } from './types';

interface RectangleElementProps {
  element: PermisElement;
  isSelected: boolean;
  onClickElement: (e: any) => void;
  onDragEnd: (e: any) => void;
  onTransformEnd: (e: any) => void;
}

export const RectangleElement: React.FC<RectangleElementProps> = ({ element, isSelected, onClickElement, onDragEnd, onTransformEnd }) => {
  return (
    <Rect
      id={element.id}
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      rotation={element.rotation || 0}
      draggable={element.draggable}
      onClick={onClickElement}
      onTap={onClickElement}
      onDragEnd={onDragEnd}
      onTransformEnd={onTransformEnd}
      fill={element.fill}
      stroke={isSelected ? '#3498db' : element.stroke}
      strokeWidth={isSelected ? 1 : element.strokeWidth || 1}
      cornerRadius={element.cornerRadius}
      opacity={element.opacity || 1}
      shadowEnabled={isSelected}
      shadowColor={'#3498db'}
      shadowBlur={isSelected ? 5 : 0}
      shadowOpacity={isSelected ? 0.3 : 0}
    />
  );
};
