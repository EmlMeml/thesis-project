import React from 'react';
import { diffWords } from 'diff'; 

interface TextDiffProps {
  oldText: string;
  newText: string;
}

export const InlineTextDiff: React.FC<TextDiffProps> = ({ oldText, newText }) => {
  // Calculates word-by-word differences
  const differences = diffWords(oldText, newText);

  return (
    <span style={{ fontFamily: 'sans-serif', lineHeight: '1.5' }}>
      {differences.map((part, index) => {
        if (part.removed) {
          return (
            <del
              key={index}
              style={{
                color: '#d32f2f',
                backgroundColor: '#ffebee',
                textDecoration: 'line-through',
                padding: '0 2px',
              }}
            >
              {part.value}
            </del>
          );
        }
        if (part.added) {
          return (
            <ins
              key={index}
              style={{
                color: '#388e3c',
                backgroundColor: '#e8f5e9',
                textDecoration: 'none',
                padding: '0 2px',
              }}
            >
              {part.value}
            </ins>
          );
        }
        return <span key={index}>{part.value}</span>;
      })}
    </span>
  );
};
