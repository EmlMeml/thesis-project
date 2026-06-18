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
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      backgroundColor: '#f9f9f9',
      minHeight: '200px'
    }}>
      {extractText()}
    </div>
  );
};