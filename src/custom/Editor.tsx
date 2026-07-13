import React, { useEffect, useState } from "react";
import { createEditor, Descendant, Editor, Transforms, Text } from "slate";
import { ReactEditor, Slate, withReact } from "slate-react";
import TextEditor from "./advancedEditor";
import FileUploader from "./FileUploader";
// @ts-ignore: Allow side-effect CSS import without type declarations

interface MyEditorProps {
  fileText?: string;
  onContentChange?: (value: Descendant[]) => void;
  onFileLoad?: (value: Descendant[]) => void;
  activeSegmentText?: string;
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

export const MyEditor: React.FC<MyEditorProps> = ({ fileText, onContentChange, onFileLoad, activeSegmentText = "" }) => {
  const [editor] = useState(() => withReact(createEditor()));
  const [value, setValue] = useState<Descendant[]>(defaultValue);
  const [editorKey, setEditorKey] = useState(0);

  const fileTextToSlateValue = (text: string) => {
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
  };

  useEffect(() => {
    if (fileText === undefined) {
      return;
    }

    const loadedValue = fileTextToSlateValue(fileText);
    setValue(loadedValue);
    setEditorKey((prev) => prev + 1);
    onContentChange?.(loadedValue);
  }, [fileText, onContentChange]);

  const handleChange = (newValue: Descendant[]) => {
    setValue(newValue);
    onContentChange?.(newValue);
  };

  useEffect(() => {
    if (!activeSegmentText) {
      return;
    }

    const targetText = activeSegmentText.trim();
    if (!targetText) {
      return;
    }

    let foundPath: number[] | null = null;
    for (const [node, path] of Editor.nodes(editor, {
      match: (n) => Text.isText(n),
    })) {
      if (node.text === targetText) {
        foundPath = path;
        break;
      }
    }

    if (!foundPath) {
      return;
    }

    const start = { path: foundPath, offset: 0 };
    const end = { path: foundPath, offset: targetText.length };
    Transforms.select(editor, { anchor: start, focus: end });
    ReactEditor.focus(editor);

    requestAnimationFrame(() => {
      const editable = document.querySelector('.editorEditable');
      if (editable instanceof HTMLElement) {
        editable.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
      <TextEditor editor={editor} onFileLoad={onFileLoad} />
    </Slate>
  );
};