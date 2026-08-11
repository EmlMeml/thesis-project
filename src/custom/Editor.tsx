import React, { useEffect, useState } from "react";
import { createEditor, Editor, Element as SlateElement, Transforms, Text, Descendant } from "slate";
import { ReactEditor, Slate, withReact } from "slate-react";
import TextEditor from "./advancedEditor";
import { CustomElement } from "../types/slate";

// @ts-ignore: Allow side-effect CSS import without type declarations

interface MyEditorProps {
  fileText?: string;
  onContentChange?: (value: Descendant[]) => void;
  onFileLoad?: (value: Descendant[]) => void;
  activeSegmentKey?: string;
  changedParagraphDiffs?: Array<{ key: string; oldText: string; newText: string }>;
  onResolvedParagraphTextChange?: (paragraphKey: string, resolvedText: string, pendingCount: number) => void;
  isGenerating?: boolean;
}


const defaultValue: Descendant[] = [
  {
    type: 'heading-one',
    paragraphKey: 'paragraphKey-0',
    children: [{ text: 'This is a heading' }],
  },
  {
    type: 'paragraph',
    paragraphKey: 'paragraphKey-1',
    children: [{ text: 'This is a simple rich text editor built with Slate.js. You can start typing here...' }],
  },
];

export const MyEditor: React.FC<MyEditorProps> = ({ fileText, onContentChange, onFileLoad, activeSegmentKey = "", changedParagraphDiffs = [], onResolvedParagraphTextChange, isGenerating = false }) => {
  const [editor] = useState(() => withReact(createEditor()));
  const [value, setValue] = useState<Descendant[]>(defaultValue);
  const [resolvedTextByParagraph, setResolvedTextByParagraph] =
  useState<Record<string, string>>({});

  const fileTextToSlateValue = (text: string): Descendant[] => {
    if (!text) {
      return [
        {
        type: 'paragraph',
        paragraphKey: 'paragraph-0',
        children: [{ text: '' }],
      },
      ];
    }
    console.log("Converting file text to Slate value:", text);
    const trimmedText = text.trim();
    const paragraphMatches = trimmedText.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);

    if (paragraphMatches && paragraphMatches.length > 0) {
      return paragraphMatches
        .map((match, index) => ({
          type: 'paragraph',
          paragraphKey: `paragraphKey-${index}`,
          children: [{ text: match.replace(/<p[^>]*>/gi, '').replace(/<\/p>/gi, '').trim() }],
        }))
        .filter((paragraph) => paragraph.children[0].text.length > 0) as Descendant[];
    }

    return trimmedText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line,index) => ({
        type: 'paragraph',
        paragraphKey: `paragraphKey-${index}`,
        children: [{ text: line }],
      })) as Descendant[];
  };

  const buildEditorValue = (baseValue: Descendant[], diffs: Array<{ key: string; oldText: string; newText: string }>): Descendant[] => {
    if (!diffs.length) {
      return baseValue;
    }

    const diffLookup = new Map(diffs.map((diff) => [diff.key, diff]));

    return (baseValue as any[]).map((paragraph, index) => {
      const paragraphKey = paragraph.paragraphKey ?? `paragraphKey-${index}`;

      const matchingDiff = diffLookup.get(paragraphKey);
      if(!matchingDiff){
        return {
          ...paragraph,
          paragraphKey,
        };
      }

      const resolvedText = resolvedTextByParagraph[paragraphKey];

      return {
        ...paragraph,
        paragraphKey,
        children:[
          {
            text: resolvedText ?? matchingDiff.oldText,
          },
        ],
        diff: {
          key: matchingDiff.key,
          oldText: matchingDiff.oldText || '',
          newText: matchingDiff.newText || '',
        },
      };
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
      editor.children = mergedValue;
      editor.onChange();
      setValue(mergedValue);
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
    
    if (!activeSegmentKey) {
      return;
    }

    const targetKey = activeSegmentKey;
    if (!targetKey) {
      return;
    }

    let foundPath: number[] | null = null;
    for (let i = 0; i < value.length; i++) {
      const node = value[i];
      const path = [i];
      if(SlateElement.isElement(node) && Editor.isBlock(editor, node)) {
        
        try {
          const paragraphKey = (node as any).paragraphKey;
            
          //console.log("## Checking node for match:", fullText);
          if (paragraphKey === targetKey) {
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

    //ReactEditor.focus(editor);

    requestAnimationFrame(() => {
      const blockEntry = Editor.above(editor, {
        at: foundPath,
        match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n),
      });

      if (!blockEntry) { return; } 
      const domNode = ReactEditor.toDOMNode( editor, blockEntry[0] ); 
      if (domNode instanceof HTMLElement) { 
        domNode.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest', });
      }
    });
  }, [activeSegmentKey, editor, value]);

  return (
    <Slate
      editor={editor}
      initialValue={value}
      onChange={handleChange}
    >
      <TextEditor
        editor={editor}
        activeSegmentText={activeSegmentKey}
        onFileLoad={onFileLoad}
        onResolvedTextChange={(paragraphKey, resolvedText, pendingCount) => {
          setResolvedTextByParagraph((prev) => ({
            ...prev,
            [paragraphKey]: resolvedText,
          }));
          onResolvedParagraphTextChange?.(paragraphKey, resolvedText, pendingCount);
        }}
        isGenerating={isGenerating}
      />
    </Slate>
  );
};