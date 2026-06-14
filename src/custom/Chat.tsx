import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

export const MyChat = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <IconButton
        aria-label={open ? 'Hide chat' : 'Open chat'}
        onClick={() => setOpen((prev) => !prev)}
        style={{
          position: 'fixed',
          right: 16,
          bottom: 16,
          zIndex: 9999,
          padding: '16px',
          borderRadius: 32,
          border: 'none',
          backgroundColor: '#16476d',
          color: '#fff',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}
      >
        <QuestionAnswerIcon />
      </IconButton>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            right: 16,
            bottom: 88,
            zIndex: 9998,
            width: 480,
            minHeight: 300,
            padding: 16,
            backgroundColor: '#f0f0f0',
            borderRadius: 8,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h2 style={{ margin: 0 }}>What can I do for you?</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              <CloseIcon
                aria-label="Close chat"
                onClick={() => setOpen(false)}
                style={{
                  padding: '6px 10px',
                  borderRadius: 6,
                  border: 'none',
                  backgroundColor: '#e0e0e0',
                  cursor: 'pointer'
                }}
              />
            </div>
          </div>

          <div id="chat-container" style={{ flex: 1, overflowY: 'auto', backgroundColor: '#ffffff', padding: 8, borderRadius: 4 }}>
            {/* Chat messages will go here */}

          </div>
        </div>
      )}
    </>
  )
}