import React, { useEffect, useState } from "react";
import { createEditor, Descendant, Editor, Element as SlateElement, Transforms, Text } from "slate";
import { ReactEditor, Slate, withReact } from "slate-react";
import TextEditor from "./advancedEditor";
// @ts-ignore: Allow side-effect CSS import without type declarations

interface MyEditorProps {
  fileText?: string;
  onContentChange?: (value: Descendant[]) => void;
  onFileLoad?: (value: Descendant[]) => void;
  activeSegmentText?: string;
  changedParagraphDiffs?: Array<{ key: string; oldText: string; newText: string }>;
}

const defaultValue = [
  {
    type: 'heading-one',
    children: [{ text: 'This is a heading' }],
  },
  {
    type: 'paragraph',
    children: [{ text: 'This is a simple rich text editor built with Slate.js. You can start typing here...' }],
  },
] as unknown as Descendant[];

export const MyEditor: React.FC<MyEditorProps> = ({ fileText, onContentChange, onFileLoad, activeSegmentText = "", changedParagraphDiffs = [] }) => {
  const [editor] = useState(() => withReact(createEditor()));
  const [value, setValue] = useState<Descendant[]>(defaultValue);
  const [editorKey, setEditorKey] = useState(0);

  const fileTextToSlateValue = (text: string): Descendant[] => {
    if (!text) {
      return [
        {
          type: 'paragraph',
          children: [{ text: '' }],
        },
      ] as Descendant[];
    }
    console.log("Converting file text to Slate value:", text);
    const trimmedText = text.trim();
    const paragraphMatches = trimmedText.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);

    if (paragraphMatches && paragraphMatches.length > 0) {
      return paragraphMatches
        .map((match) => ({
          type: 'paragraph',
          children: [{ text: match.replace(/<p[^>]*>/gi, '').replace(/<\/p>/gi, '').trim() }],
        }))
        .filter((paragraph) => paragraph.children[0].text.length > 0) as Descendant[];
    }

    return trimmedText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => ({
        type: 'paragraph',
        children: [{ text: line }],
      })) as Descendant[];
  };

  const buildEditorValue = (baseValue: Descendant[], diffs: Array<{ key: string; oldText: string; newText: string }>): Descendant[] => {
    if (!diffs.length) {
      return baseValue;
    }

    const diffLookup = new Map(diffs.map((segment) => [segment.newText?.trim(), segment]));

    return (baseValue as any[]).map((paragraph) => {
      const paragraphText = (paragraph.children || [])
        .map((child: any) => child.text || '')
        .join('')
        .trim();

      const matchingDiff = diffLookup.get(paragraphText);
      if (matchingDiff) {
        return {
          ...paragraph,
          diff: {
            oldText: matchingDiff.oldText || '',
            newText: matchingDiff.newText || '',
          },
        };
      }

      return paragraph;
    }) as Descendant[];
  };

  //change Text in Editor
  useEffect(() => {
    if (fileText === undefined) {
      return;
    }
    console.log("FileText:", fileText);
    const loadedValue = fileTextToSlateValue(fileText);
    const mergedValue = buildEditorValue(loadedValue, changedParagraphDiffs);
    const currentValue = editor.children;

    if (JSON.stringify(currentValue) !== JSON.stringify(mergedValue)) {
      resetSelectionIfNeeded();
      editor.children = mergedValue as Descendant[];
      editor.onChange();
      setValue(mergedValue);
      setEditorKey((prev) => prev + 1);
      onContentChange?.(mergedValue);
      handleChange(mergedValue);
    }
  }, [fileText, editor, onContentChange, changedParagraphDiffs]);

  const handleChange = (newValue: Descendant[]) => {
    setValue(newValue);
    onContentChange?.(newValue);
  };

  const resetSelectionIfNeeded = () => {
    const selection = editor.selection;
    if (!selection) {
      return;
    }

    const anchorPathValid = Editor.hasPath(editor, selection.anchor.path);
    const focusPathValid = Editor.hasPath(editor, selection.focus.path);

    if (!anchorPathValid || !focusPathValid) {
      Transforms.deselect(editor);
    }
  };


  // Scroll to the active segment when it changes
  useEffect(() => {
    //console.log("## Active segment text changed:", activeSegmentText);
    
    if (!activeSegmentText) {
      return;
    }

    const targetText = activeSegmentText.trim();
    //console.log("## Searching for target text in editor:", targetText);
    if (!targetText) {
      return;
    }

    let foundPath: number[] | null = null;
    for (let i = 0; i < value.length; i++) {
      const node = value[i];
      const path = [i];
      if(SlateElement.isElement(node) && Editor.isBlock(editor, node)) {
        
        try {
          const fullText = (node as any).children
            .map((c: any) => (typeof c.text === 'string' ? c.text : ''))
            .join('')
            .trim();
          
          if (!fullText){
            continue;
          }
          //console.log("## Checking node for match:", fullText);
          if (fullText === targetText || fullText.includes(targetText)) {
            // find first child index that contains text to build a text-node path
            const childIndex = (node as any).children.findIndex((c: any) => typeof c.text === 'string' && c.text.trim().length > 0);
            foundPath = childIndex >= 0 ? path.concat(childIndex) : path.concat(0);
            break;
          }
        } catch (err) {
          // ignore and continue searching
          console.warn('Error while inspecting node for match', err);
        }
      }
    }

    if (!foundPath || !Editor.hasPath(editor, foundPath)) {
      //console.warn("Could not find the text segment in the editor:", targetText);
      return;
    }

    ReactEditor.focus(editor);

    requestAnimationFrame(() => {
      const blockEntry = Editor.above(editor, {
        at: foundPath,
        match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n),
      });

      let domNode = null;
      if (blockEntry) {
        domNode = ReactEditor.toDOMNode(editor, blockEntry[0]);
      } else {
        const [nodeToScroll] = Editor.node(editor, foundPath);
        domNode = ReactEditor.toDOMNode(editor, nodeToScroll);
      }

      if (domNode instanceof HTMLElement) {
        domNode.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      }
    });
  }, [activeSegmentText, editor]);

  return (
    <Slate
      key={editorKey}
      editor={editor}
      initialValue={value}
      onChange={handleChange}
    >
      <TextEditor editor={editor} activeSegmentText={activeSegmentText} onFileLoad={onFileLoad} />
    </Slate>
  );
};