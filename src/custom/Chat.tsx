import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

type Message = { sender: string; text: string };

export const MyChat = () => {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState<Message[]>([]);

  const sendMessage = async () => {
    if(!message.trim()) return;

    const userMessage = { sender: 'You', text: message };
    setChatLog((prev) => [...prev, userMessage]);
    setMessage("");

    const res = await fetch('http://localhost:4000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    const messageData = await res.json();
    setChatLog((prev) => [...prev, { sender: 'Bot', text: messageData.reply }]);
  };

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
          backgroundColor: '#33407f',
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
            backgroundColor: '#e9ebf6',
            borderRadius: 8,
            border: '0.5px solid #dbdef0',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h2 style={{ margin: 0 }}>Chat - Bot</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              <CloseIcon
                aria-label="Close chat"
                onClick={() => setOpen(false)}
                style={{
                  padding: '6px 10px',
                  borderRadius: 6,
                  border: 'none',
                  backgroundColor: '#e9ebf6',
                  cursor: 'pointer'
                }}
              />
            </div>
          </div>
                
          <div id="chat-container" style={{ flex: 1, overflowY: 'auto', backgroundColor: '#ffffff', padding: 8, borderRadius: 4 }}>
            {chatLog.map((msg, index) => (
                  <p key={index}>
                    <strong>{msg.sender}:</strong>{" "}
                    <span>{msg.text}</span>
                  </p>
                ))}
            
            <input 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message and press Enter..."
            />

          </div>
        </div>
      )}
    </>
  )
}