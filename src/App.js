import './css/App.css';
import './css/wave-test.css';
import './css/form.css';
import React, { useState } from 'react';
import TopBar from './custom/TopBar.js';
import { MyEditor } from './custom/Editor.tsx';
import { MyChat } from './custom/Chat.tsx';
import { TextPreview } from './custom/TextPreview.tsx';
import { TextNav } from './custom/TextNav.tsx';
import { ChangeCreator } from './custom/ChangeCreator.tsx';

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
      <TopBar/>
      <div id="main-content">
        <div id="text-navigation">
          <TextNav content={editorContent} />
        </div>
        <div id="editor-container">
          <MyEditor fileText={fileText} onContentChange={setEditorContent} onFileLoad={handleFileLoad}  />
          <ChangeCreator />
        </div>
        <MyChat />
      </div>
    </div>
  );
}

export default App;
