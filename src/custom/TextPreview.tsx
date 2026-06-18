import React from 'react';
import { Descendant } from 'slate';

interface TextPreviewProps {
  content?: Descendant[];
}

export const TextPreview: React.FC<TextPreviewProps> = ({ content = [] }) => {
  // Extract text from Slate editor structure
  const extractText = () => {
    return content
      .map((node) => {
        if ('children' in node && node.children) {
          return node.children
            .map((child: any) => child.text || '')
            .join('');
        }
        return '';
      })
      .join('\n');
  };

  return (
    <div id="text-preview" style={{
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      backgroundColor: '#f9f9f9',
      width: '95%',
      maxHeight: '865px',
      overflowY: 'auto',
      textAlign: 'left'
    }}>
      {extractText()}
    </div>
  );
};