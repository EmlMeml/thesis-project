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

//use Levenshtein-Distanz for this
function calculateChangeNumber(oldText = '', newText = '') {

  if(oldText === newText){
    return 0;
  }
  
  const oldLength = oldText.length;
  const newLength = newText.length;

  //console.log("++ oldLength: ",oldLength+" New Length: ",newLength);

  const matrix = Array.from(
    {length: oldLength+1},
    () => new Array(newLength+1).fill(0)
  );

  for(let i=0; i <= oldLength; i++){
    matrix[i][0] = i;
  }

  for(let j=0; j <= newLength; j++){
    matrix[0][j] = j;
  }

  for(let i=1; i<= oldLength;i++){
    for(let j=1; j <= newLength;j++){
      const cost = oldText[i-1] === newText[j-1]? 0:1;
      //console.log("++ cost: ",cost);
      matrix[i][j] = Math.min(
        matrix[i-1][j]+1, //removed character
        matrix[i][j-1]+1, //added character
        matrix[i-1][j-1]+cost //characters are equal/the same
      );
    }
  }
  //console.log("++ Result: ",matrix[oldLength][newLength]);
  return matrix[oldLength][newLength];
 
}

function App() {

  const [editorContent, setEditorContent] = useState([]);
  const [fileText, setFileText] = useState('');
  const [activeSegmentKey, setActiveSegmentKey] = useState('');
  const [previousVersions, setPreviousVersions] = useState([]);
  const [changedSegmentTexts, setChangedSegmentTexts] = useState([]);
  const [changedParagraphDiffs, setChangedParagraphDiffs] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resolvedTexts, setResolvedTexts] = useState<Record<string,string>>({});
  const editorText = editorContent
    .map((node) => (node.children ? node.children.map((child) => child.text).join('') : ''))
    .join('\n');

  const handleFileLoad = (text) => {
    setFileText(text);
  };

  const handleSegmentClick = (paragraphKey) => {
    setActiveSegmentKey(paragraphKey);
  };

  const handleAcceptChanges = () => {
      if (!editorContent.length) {
        return;
      }

    const finalContent = editorContent.map((paragraph: any, index) => {
      const paragraphKey =
      paragraph.paragraphKey ?? `paragraphKey-${index}`;

      const resolvedText = resolvedTexts[paragraphKey];

      if (resolvedText === undefined) {
        return paragraph;
      }

      return {
        ...paragraph,
        paragraphKey,
        children: [
          {
            text: resolvedText,
          },
        ],
      };
    });

    setEditorContent(finalContent);

    const finalText = finalContent
      .map((paragraph: any) =>
        paragraph.children
          ?.map((child: any) => child.text || '')
          .join('') ?? ''
      )
      .join('\n');

    setFileText(finalText);

    setChangedSegmentTexts([]);
    setChangedParagraphDiffs([]);
    setResolvedTexts({});
    setActiveSegmentKey('');
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
    const changedParagraphDiff = [];

    for (let i = 0; i < paragraphCount; i++) {
      const oldParagraph = previousParagraphs[i] || '';
      const newParagraph = newParagraphs[i] || '';

      if (oldParagraph === newParagraph) {
        console.log(`Paragraph ${i} unchanged.`);
        continue;
      }

      const changeNumber = calculateChangeNumber(oldParagraph, newParagraph);

      console.log("old: ",oldParagraph+" new: ",newParagraph);
      changedParagraphDiff.push({
        key: `paragraphKey-${i}`,
        oldText: oldParagraph,
        newText: newParagraph,
      });

    }
    
    setChangedParagraphDiffs(changedParagraphDiff);

    setChangedSegmentTexts(
      changedParagraphDiff.map((diff) => ({
        paragraphKey: diff.key,
        text: diff.newText,
        changeNumber: calculateChangeNumber(diff.oldText, diff.newText),
      }))
    );
     // set to first changed Paragraph
    if (changedParagraphDiff.length > 0) {
      setActiveSegmentKey(changedParagraphDiff[0].key);
    } else {
      setActiveSegmentKey('');
    }
    setFileText(replyText);
  };
  console.log("isGenerating: ",isGenerating);
  return (
    <Box sx={{ width: '95%', padding: 2, display: 'flex', flexDirection: 'column', gap: 0 }}>
      <TopBar />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
          <TextNav
            content={editorContent}
            onSegmentClick={handleSegmentClick}
            changedSegments={changedSegmentTexts}
          />
          <AccteptBtn onClick={handleAcceptChanges} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 0, alignItems: 'flex-start', paddingLeft: '24px' }}>
          <MyEditor
            fileText={fileText}
            onContentChange={setEditorContent}
            onFileLoad={handleFileLoad}
            activeSegmentKey={activeSegmentKey}
            changedParagraphDiffs={changedParagraphDiffs}
            onResolvedParagraphTextChange={(paragraphKey, resolvedText, pendingCount) => {
              setResolvedTexts((prev) => ({
                ...prev,
                [paragraphKey]: resolvedText,
              }));
              setChangedSegmentTexts((prev) => prev.map((segment) =>
                segment.paragraphKey === paragraphKey
                  ? { ...segment, text: resolvedText, changeNumber: pendingCount }
                  : segment
              ));
            }}
            isGenerating={isGenerating}
          />
          <ChangeCreator editorText={editorText} onTextReplace={handleAiReply} onGeneratingChange={setIsGenerating} isGenerating={isGenerating}/>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
