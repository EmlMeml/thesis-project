import './css/App.css';
import './css/wave-test.css';
import './css/form.css';
import React, { useState } from 'react';
import TopBar from './custom/TopBar.js';
import { MyEditor } from './custom/Editor.tsx';
import { MyChat } from './custom/Chat.tsx';
import { TextNav } from './custom/TextNav.tsx';
import { ChangeCreator } from './custom/ChangeCreator.tsx';
import { AccteptBtn } from './custom/AccteptBtn.tsx';
import { Grid, Stack } from "@mui/material";

export function serializeEditorContentToParagraphs(content) {
  console.log("## Content: ",content);
  if (typeof content === 'string') {
    const paragraphs = content
      .split(/\n/)
      .map((paragraph) => paragraph.trim())
      .filter((paragraph) => paragraph.length > 0);

    return paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join('');
  }

  if (!Array.isArray(content)) {
    return '';
  }

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

function extractParagraphsFromHtml(html = '') {
  const matches = html.match(/<p>(.*?)<\/p>/gs) || [];
  return matches.map((paragraph) => paragraph.replace(/^<p>|<\/p>$/g, '').trim());
}

function App() {
  const [editorContent, setEditorContent] = useState([]);
  const [fileText, setFileText] = useState('');
  const [activeSegmentText, setActiveSegmentText] = useState('');
  const [previousVersions, setPreviousVersions] = useState([]);
  const [changedSegmentTexts, setChangedSegmentTexts] = useState([]);
  const editorText = editorContent
    .map((node) => (node.children ? node.children.map((child) => child.text).join('') : ''))
    .join('\n');

  const handleFileLoad = (text) => {
    setFileText(text);
  };

  const handleSegmentClick = (text) => {
    setActiveSegmentText(text);
  };

  const handleAcceptChanges = () => {
    setChangedSegmentTexts([]);
    setActiveSegmentText('');
  };

  const handleAiReply = (replyText) => {
    if (!replyText) {
      console.log("No reply text provided. Skipping saving previous version.");
      return;
    }

    //serialize both version to HTML to compare them
    const previousVersionHtml = serializeEditorContentToParagraphs(editorContent);
    const newVersionHtml = serializeEditorContentToParagraphs(replyText);
    setPreviousVersions((prev) => [...prev, previousVersionHtml || '<p></p>']);

    //extract paragraphs
    const previousParagraphs = extractParagraphsFromHtml(previousVersionHtml);
    const newParagraphs = extractParagraphsFromHtml(newVersionHtml);
    const paragraphCount = Math.max(previousParagraphs.length, newParagraphs.length);
    const changedParagraphs = [];

    for (let i = 0; i < paragraphCount; i++) {
      const oldParagraph = previousParagraphs[i] || '';
      const newParagraph = newParagraphs[i] || '';

      if (!oldParagraph && newParagraph) {
        console.log(`Paragraph ${i} added:`, newParagraph);
        changedParagraphs.push(newParagraph);
        continue;
      }

      if (oldParagraph && !newParagraph) {
        console.log(`Paragraph ${i} removed:`, oldParagraph);
        continue;
      }

      if (oldParagraph === newParagraph) {
        console.log(`Paragraph ${i} unchanged.`);
        continue;
      }

      if (newParagraph.includes(oldParagraph) || oldParagraph.includes(newParagraph)) {
        console.log(`Paragraph ${i} modified in place.`);
        console.log('Old:', oldParagraph);
        console.log('New:', newParagraph);
        changedParagraphs.push(newParagraph);
      } else {
        console.log(`Paragraph ${i} changed completely.`);
        console.log('Old:', oldParagraph);
        console.log('New:', newParagraph);
        changedParagraphs.push(newParagraph);
      }
    }

    if (changedParagraphs.length > 0) {
      setChangedSegmentTexts(changedParagraphs);
      setActiveSegmentText(changedParagraphs[0]);
    } else {
      setChangedSegmentTexts([]);
    }

    setFileText(replyText);
  };

  return (
    <Stack>
      <Grid className="App" container direction="column">
      <TopBar/>
        <Grid id="main-content" container size={11}>
          <Grid id="text-navigation" container size={9} direction="row">
            <Grid item style={{ flex: 1, overflowY: "auto" }}>
              <TextNav content={editorContent} onSegmentClick={handleSegmentClick} changedTexts={changedSegmentTexts} />
            </Grid>
            <Grid item style={{marginTop:"32px"}}>
              <AccteptBtn onClick={handleAcceptChanges} />
            </Grid>
          </Grid>
          <Grid id="editor-container" container size={12} direction="row" >
            <MyEditor fileText={fileText} onContentChange={setEditorContent} onFileLoad={handleFileLoad} activeSegmentText={activeSegmentText} />
            <Stack spacing={1} style={{ marginLeft: 8 }}>
              <ChangeCreator editorText={editorText} onTextReplace={handleAiReply} />
              
            </Stack>
          </Grid>
      </Grid>
    </Grid>
    </Stack>
    
  );
}

export default App;
