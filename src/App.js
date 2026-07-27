import './css/App.css';
import './css/wave-test.css';
import './css/form.css';
import React, { useState } from 'react';
import TopBar from './custom/TopBar.js';
import { MyEditor } from './custom/Editor.tsx';
import { MyChat } from './custom/Chat.tsx';
import { TextNav } from './custom/TextNav.tsx';
import { ChangeCreator } from './custom/ChangeCreator.tsx';
import { Grid, Stack } from "@mui/material";

export function serializeEditorContentToParagraphs(content) {
  const paragraphs = (content || [])
    .map((node) => {
      if (!node || !Array.isArray(node.children)) {
        return '';
      }

      return node.children.map((child) => child.text || '').join('').trim();
    })
    .filter((paragraph) => paragraph.length > 0);

  return paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join('');
}

function App() {
  const [editorContent, setEditorContent] = useState([]);
  const [fileText, setFileText] = useState('');
  const [activeSegmentText, setActiveSegmentText] = useState('');
  const [previousVersions, setPreviousVersions] = useState([]);
  const editorText = editorContent
    .map((node) => (node.children ? node.children.map((child) => child.text).join('') : ''))
    .join('\n');

  const handleFileLoad = (text) => {
    setFileText(text);
  };

  const handleSegmentClick = (text) => {
    setActiveSegmentText(text);
  };

  const handleAiReply = (replyText) => {
    if (!replyText) {
      console.log("No reply text provided. Skipping saving previous version.");
      return;
    }

    const previousVersion = serializeEditorContentToParagraphs(editorContent);
    setPreviousVersions((prev) => [...prev, previousVersion || '<p></p>']);
    setFileText(replyText);
  };

  return (
    <Stack>
      <Grid className="App" container direction="column">
      <TopBar/>
        <Grid id="main-content" container size={11}>
          <Grid id="text-navigation" container size={9}>
            <TextNav content={editorContent} onSegmentClick={handleSegmentClick} />
          </Grid>
          <Grid id="editor-container" container size={12} direction="row" >
            <MyEditor fileText={fileText} onContentChange={setEditorContent} onFileLoad={handleFileLoad} activeSegmentText={activeSegmentText} />
            <ChangeCreator editorText={editorText} />
          </Grid>
      </Grid>
    </Grid>
    </Stack>
    
  );
}

export default App;
