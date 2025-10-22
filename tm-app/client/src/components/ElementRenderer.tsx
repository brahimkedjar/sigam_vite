// =============================================================
// File: components/elements/ElementRenderer.tsx
// (Switch component that prevents hooks-in-map issues)
// =============================================================
import React from 'react';
import type { PermisElement } from './types';
import { TextElement } from './TextElement';
import { RectangleElement } from './RectangleElement';
import { LineElement } from './LineElement';
import { ImageElement } from './ImageElement';
import { QRCodeElement } from './QRCodeElement'; // Add this import

interface ElementRendererProps {
  element: PermisElement;
  isSelected: boolean;
  zoom: number;
  onClickElement: (e: any) => void;
  onDragEnd: (e: any) => void;
  onTransformEnd: (e: any) => void;
  onDblClickText: () => void;
}

export const ElementRenderer: React.FC<ElementRendererProps> = ({ element, isSelected, zoom, onClickElement, onDragEnd, onTransformEnd, onDblClickText }) => {
  if (element.type === 'text') {
    return (
      <TextElement
        element={element}
        isSelected={isSelected}
        zoom={zoom}
        onClickElement={onClickElement}
        onDragEnd={onDragEnd}
        onTransformEnd={onTransformEnd}
        onDblClickText={onDblClickText}
      />
    );
  }
  if (element.type === 'rectangle') {
    return (
      <RectangleElement
        element={element}
        isSelected={isSelected}
        onClickElement={onClickElement}
        onDragEnd={onDragEnd}
        onTransformEnd={onTransformEnd}
      />
    );
  }
  if (element.type === 'line') {
    return (
      <LineElement
        element={element}
        isSelected={isSelected}
        onClickElement={onClickElement}
        onDragEnd={onDragEnd}
        onTransformEnd={onTransformEnd}
      />
    );
  }
  if (element.type === 'image') {
    return (
      <ImageElement
        element={element}
        isSelected={isSelected}
        onClickElement={onClickElement}
        onDragEnd={onDragEnd}
        onTransformEnd={onTransformEnd}
      />
    );
  }
  if (element.type === 'qrcode') {
    return (
      <QRCodeElement
        element={element}
        isSelected={isSelected}
        zoom={zoom}
        onClickElement={onClickElement}
        onDragEnd={onDragEnd}
        onTransformEnd={onTransformEnd}
      />
    );
  }
  return null;
};