import './App.css';
import './wave-test.css';
import React, { useState } from 'react';
import TopBar from './custom/TopBar.js';
import { MyEditor } from './custom/Editor.tsx';
import { MyChat } from './custom/Chat.tsx';
import { TextPreview } from './custom/TextPreview.tsx';
import { TextNav } from './custom/TextNav.tsx';

function textToSlateValue(text) {
  if (!text) {
    return [
      {
        type: 'paragraph',
        children: [{ text: '' }],
      },
    ];
  }

  return text.split(/\r?\n/).map((line) => ({
    type: 'paragraph',
    children: [{ text: line }],
  }));
}

function App() {
  const [editorContent, setEditorContent] = useState([]);
  const [fileText, setFileText] = useState('');

  const handleFileLoad = (text) => {
    setFileText(text);
  };

  return (
    <div className="App">
      <TopBar onFileLoad={handleFileLoad} />
      <div id="main-content">
        <TextNav />
        <div id="editor-container">
          <MyEditor fileText={fileText} onContentChange={setEditorContent} />
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
