import './App.css';
import './wave-test.css';
import React, { useState } from 'react';
import TopBar from './custom/TopBar.js';
import { MyEditor } from './custom/Editor.tsx';
import { MyChat } from './custom/Chat.tsx';
import { TextPreview } from './custom/TextPreview.tsx';

function App() {
  const [editorContent, setEditorContent] = useState([]);

  return (
    <div className="App">
      <TopBar />
      <div id="main-content">
        <div id="editor-container">
          <MyEditor onContentChange={setEditorContent} />
        </div>
        <div id="animation-container">
          <TextPreview content={editorContent} />
        </div>
        <MyChat />
      </div>
    </div>
  );
}

export default App;
