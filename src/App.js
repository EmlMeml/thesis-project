import './App.css';
import './wave-test.css';
import React from 'react';
import TopBar from './custom/TopBar.js';
import { MyEditor } from './custom/Editor.tsx';
import { MyChat } from './custom/Chat.tsx';

function App() {
  return (
    <div className="App">
      <TopBar />
      <div id="main-content">
        <div id="editor-container">
          <MyEditor />
        </div>
        <MyChat />
      </div>
      
    </div>
    
  );
}

export default App;
