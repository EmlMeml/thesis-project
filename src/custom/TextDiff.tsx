import React from 'react';
import { ChangeObject, diffWords } from 'diff'; 
import Chip from '@mui/material/Chip';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

interface TextDiffProps {
  oldText: string;
  newText: string;
}



export const InlineTextDiff: React.FC<TextDiffProps> = ({ oldText, newText }) => {
  // Calculates word-by-word differences
  const differences = diffWords(oldText, newText);

  function acceptChange(acceptedPart:ChangeObject<String>, key?:number){ 
    // Implement the logic to accept the change here
    const removedPart = document.getElementById(`removed-part-${key}`);
    removedPart?.style.setProperty('display', 'none');

    const addedPart = document.getElementById(`added-part-${key}`);
    addedPart?.style.setProperty('text-decoration', 'none');
    addedPart?.style.setProperty('background-color', 'transparent'); 
    addedPart?.style.setProperty('color', 'inherit');

    const acceptChip = document.getElementById(`accept-chip-${key}`);
    acceptChip?.style.setProperty('display', 'none');
    const rejectChip = document.getElementById(`reject-chip-${key}`);
    rejectChip?.style.setProperty('display', 'none');
  }

  function rejectChange(rejectedPart:ChangeObject<String>, key?:number){
    
    const removedPart = document.getElementById(`removed-part-${key}`);
    removedPart?.style.setProperty('display', 'none');

    const acceptChip = document.getElementById(`accept-chip-${key}`);
    acceptChip?.style.setProperty('display', 'none');
    const rejectChip = document.getElementById(`reject-chip-${key}`);
    rejectChip?.style.setProperty('display', 'none');
  
  }

  return (
    <span style={{ fontFamily: 'sans-serif', lineHeight: '1.5' }}>
      {differences.map((part, index) => {
        if (part.removed) {
          return (
            <del
              id={`removed-part-${index}`}
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
            <><ins
              id={`added-part-${index}`}
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
              <Chip id={`accept-chip-${index}`} label="Accept?" size="small" variant='outlined' color="success" onClick={() => {acceptChange(part,index)} } icon={<CheckIcon />} /><Chip id={`reject-chip-${index}`} size="small" variant='outlined' color="error" onClick={() => {rejectChange(part,index) } } icon={<CloseIcon />} />
          </>
             
          );
        }
        return(
        <><span key={index}>
          {part.value}
          
        </span></>);
        })});
      
    </span> 
  );
};
