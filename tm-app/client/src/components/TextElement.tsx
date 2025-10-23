// =============================================================
// File: components/elements/TextElement.tsx
// =============================================================
import React, { useEffect, useRef, useState } from 'react';
import { Group, Rect, Text } from 'react-konva';
import type { PermisElement } from './types';

interface TextElementProps {
  element: PermisElement;
  isSelected: boolean;
  zoom: number;
  onClickElement: (e: any) => void;
  onDragEnd: (e: any) => void;
  onTransformEnd: (e: any) => void;
  onDblClickText: () => void;
}

export const TextElement: React.FC<TextElementProps> = ({
  element, isSelected, zoom, onClickElement, onDragEnd, onTransformEnd, onDblClickText
}) => {
  const textNodeRef = useRef<any>(null);
  const [textBounds, setTextBounds] = useState({ width: element.width || 240, height: element.height || 40 });

  // Update bounds whenever text or style changes
  useEffect(() => {
    if (textNodeRef.current) {
      const box = textNodeRef.current.getClientRect();
      setTextBounds({
        width: box.width,
        height: box.height,
      });
    }
  }, [
    element.text,
    element.fontSize,
    element.fontFamily,
    element.lineHeight,
    element.wrap,
    element.width, // Added to react to width changes
  ]);

  const common = {
    id: element.id,
    x: element.x,
    y: element.y,
    width: textBounds.width,
    height: textBounds.height,
    rotation: element.rotation || 0,
    draggable: element.draggable,
    onClick: onClickElement,
    onTap: onClickElement,
    onDragEnd,
    onTransformEnd,
    opacity: element.opacity || 1,
  } as any;

  return (
    <Group {...common}>
      {isSelected && (
        <Rect
          x={0}
          y={0}
          width={textBounds.width}
          height={textBounds.height}
          fill="rgba(52, 152, 219, 0.1)"
          stroke="#3498db"
          strokeWidth={1}
        />
      )}
      <Text
        ref={textNodeRef}
        x={0}
        y={0}
        text={element.text}
        fontSize={element.fontSize}
        fontFamily={element.fontFamily}
        fill={element.color}
        align={element.textAlign}
        lineHeight={element.lineHeight}
        wrap={element.wrap}
        onDblClick={onDblClickText}
        direction={element.direction || 'ltr'}
        listening={true}
        perfectDrawEnabled={false}
        width={element.width} // Added to enable wrapping within fixed width
      />
    </Group>
  );
};
