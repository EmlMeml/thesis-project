import './css/App.css';
import './css/wave-test.css';
import './css/form.css';
import { useState } from 'react';
import TopBar from './custom/TopBar';
import { MyEditor } from './custom/Editor';
import { TextNav } from './custom/TextNav';
import { ChangeCreator } from './custom/ChangeCreator';
import { AccteptBtn } from './custom/AccteptBtn';
import { Box } from "@mui/material";

export function serializeEditorContentToParagraphs(content) {
  //console.log("## Content: ",content);
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
  const matches = html.match(/<p>([\s\S]*?)<\/p>/g) || [];
  return matches.map((paragraph) => paragraph.replace(/^<p>|<\/p>$/g, '').trim());
}

function calculateChangeNumber(oldText = '', newText = '') {
  if (!oldText && !newText) {
    return 0;
  }

  if (!oldText || !newText) {
    return Math.max(oldText.length, newText.length);
  }

  const maxLength = Math.max(oldText.length, newText.length);
  let changeCount = 0;

  for (let index = 0; index < maxLength; index += 1) {
    if (oldText[index] !== newText[index]) {
      changeCount += 1;
    }
  }

  return changeCount;
}

function App() {
  const [editorContent, setEditorContent] = useState([]);
  const [fileText, setFileText] = useState('');
  const [activeSegmentText, setActiveSegmentText] = useState('');
  const [previousVersions, setPreviousVersions] = useState([]);
  const [changedSegmentTexts, setChangedSegmentTexts] = useState([]);
  const [changedParagraphDiffs, setChangedParagraphDiffs] = useState([]);
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
    setChangedParagraphDiffs([]);
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
    const changedParagraphDetails = [];
    const oldParagraphList = [];

    for (let i = 0; i < paragraphCount; i++) {
      const oldParagraph = previousParagraphs[i] || '';
      const newParagraph = newParagraphs[i] || '';

      if (!oldParagraph && newParagraph) {
        console.log(`Paragraph ${i} added:`, newParagraph);
        changedParagraphs.push(newParagraph);
        changedParagraphDetails.push({ text: newParagraph, changeNumber: calculateChangeNumber('', newParagraph) });
        oldParagraphList.push('');
        continue;
      }

      if (oldParagraph && !newParagraph) {
        console.log(`Paragraph ${i} removed:`, oldParagraph);
        oldParagraphList.push(oldParagraph);
        continue;
      }

      if (oldParagraph === newParagraph) {
        console.log(`Paragraph ${i} unchanged.`);
        continue;
      }

      const changeNumber = calculateChangeNumber(oldParagraph, newParagraph);

      if (newParagraph.includes(oldParagraph) || oldParagraph.includes(newParagraph)) {
        console.log(`Paragraph ${i} modified in place.`);
        console.log('Change number:', changeNumber);
        changedParagraphs.push(newParagraph);
        changedParagraphDetails.push({ text: newParagraph, changeNumber });
        oldParagraphList.push(oldParagraph);
      } else {
        console.log(`Paragraph ${i} changed completely.`);
        console.log('Change number:', changeNumber);
        changedParagraphs.push(newParagraph);
        changedParagraphDetails.push({ text: newParagraph, changeNumber });
        oldParagraphList.push(oldParagraph);
      }
    }

    if (changedParagraphDetails.length > 0) {
      setChangedSegmentTexts(changedParagraphDetails);
      setChangedParagraphDiffs(changedParagraphDetails.map((segment, index) => ({
        key: `${index}-${segment.changeNumber}`,
        oldText: oldParagraphList[index] || '',
        newText: segment.text,
      })));
      setActiveSegmentText(changedParagraphDetails[0].text);
    } else {
      setChangedSegmentTexts([]);
      setChangedParagraphDiffs([]);
    }

    setFileText(replyText);
  };

  return (
    <Box sx={{ width: '95%', padding: 2, display: 'flex', flexDirection: 'column', gap: 0 }}>
      <TopBar />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <TextNav
            content={editorContent}
            onSegmentClick={handleSegmentClick}
            changedTexts={changedSegmentTexts.map((segment) => segment.text)}
            changedSegments={changedSegmentTexts}
          />
          <AccteptBtn onClick={handleAcceptChanges} />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 0, alignItems: 'flex-start' }}>
          
            <MyEditor
              fileText={fileText}
              onContentChange={setEditorContent}
              onFileLoad={handleFileLoad}
              activeSegmentText={activeSegmentText}
              changedParagraphDiffs={changedParagraphDiffs}
            />
          
            <ChangeCreator editorText={editorText} onTextReplace={handleAiReply} />
          
        </Box>
      </Box>
    </Box>
  );
}

export default App;
