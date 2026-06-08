export const MyChat = () => {
  
  // Render the Slate context.
 return (
    <div style={{ width: '20%',padding: '16px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
      <h1>Chat</h1> 
      <div id="chat-container" style={{ height: '70%', overflowY: 'auto', backgroundColor: '#ffffff', padding: '8px', borderRadius: '4px'}}>
        {/* Chat messages will go here */}
        
      </div>
    </div>
  )
}