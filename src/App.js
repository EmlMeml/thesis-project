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
import { Grid, Stack } from "@mui/material";

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
  const [activeSegmentText, setActiveSegmentText] = useState('');

  const handleFileLoad = (text) => {
    setFileText(text);
  };

  const handleSegmentClick = (text) => {
    setActiveSegmentText(text);
  };

  return (
    <Stack>
      <Grid className="App" container direction="column">
      <TopBar/>
        <Grid id="main-content" container size={13}>
          <Grid id="text-navigation" container size={9}>
            <TextNav content={editorContent} onSegmentClick={handleSegmentClick} />
          </Grid>
          <Grid id="editor-container" container size={9} direction="row" >
            <MyEditor fileText={fileText} onContentChange={setEditorContent} onFileLoad={handleFileLoad} activeSegmentText={activeSegmentText} />
            <ChangeCreator />
          </Grid>
          <MyChat />
      </Grid>
    </Grid>
    </Stack>
    
  );
}

export default App;
