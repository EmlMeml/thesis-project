import React, { useState } from 'react';
import InfoIcon from '@mui/icons-material/Info';

interface InfoBtnProps {
  type: 'scope' | 'intensity' | string;
}

const descriptions: Record<string, string> = {
  scope: 'Scope controls how much of the text the AI should change: 1 = minor edits, 2 = moderate edits, 3 = considerable edits across paragraphs.',
  intensity: 'Intensity controls the strength of the edits: "Sand" = very mild, "Coppel-Stone" = moderate, "Boulder" = very intense.',
};

export const InfoBtn: React.FC<InfoBtnProps> = ({ type }) => {
  const [hovered, setHovered] = useState(false);
  const description = descriptions[type] || 'Hover to see more information.';

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <InfoIcon style={{ fontSize: 24, color: '#2b4354' }} />
      {hovered && (
        <div
          style={{
            width:'200px',
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginTop: 8,
            padding: '8px 12px',
            maxWidth: 260,
            backgroundColor: '#2b4354',
            color: '#fff',
            borderRadius: 8,
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
            zIndex: 10,
            fontSize: 12,
            lineHeight: 1.4,
            textAlign: 'left',
          }}
        >
          {description}
        </div>
      )}
    </div>
  );
};

export default InfoBtn;
