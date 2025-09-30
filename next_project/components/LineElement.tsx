// =============================================================
// File: components/elements/LineElement.tsx
// =============================================================
import React from 'react';
import { Line } from 'react-konva';
import type { PermisElement } from './types';

interface LineElementProps {
  element: PermisElement;
  isSelected: boolean;
  onClickElement: (e: any) => void;
  onDragEnd: (e: any) => void;
  onTransformEnd: (e: any) => void;
}

export const LineElement: React.FC<LineElementProps> = ({ element, isSelected, onClickElement, onDragEnd, onTransformEnd }) => {
  return (
    <Line
      id={element.id}
      x={element.x}
      y={element.y}
      points={[0, 0, element.width || 0, 0]}
      rotation={element.rotation || 0}
      draggable={element.draggable}
      onClick={onClickElement}
      onTap={onClickElement}
      onDragEnd={onDragEnd}
      onTransformEnd={onTransformEnd}
      stroke={isSelected ? '#3498db' : element.stroke}
      strokeWidth={isSelected ? 1 : element.strokeWidth || 1}
      lineCap={element.lineCap}
      lineJoin={element.lineJoin}
      opacity={element.opacity || 1}
      hitStrokeWidth={Math.max(10, (element.strokeWidth || 1) * 3)}
      shadowEnabled={isSelected}
      shadowColor={'#3498db'}
      shadowBlur={isSelected ? 5 : 0}
      shadowOpacity={isSelected ? 0.3 : 0}
    />
  );
};


