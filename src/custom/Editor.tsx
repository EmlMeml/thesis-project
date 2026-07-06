import React, { useEffect, useState } from "react";
import { createEditor, Descendant } from "slate";
import { Slate, withReact } from "slate-react";
import TextEditor from "./advancedEditor";
import FileUploader from "./FileUploader";
// @ts-ignore: Allow side-effect CSS import without type declarations

interface MyEditorProps {
  fileText?: string;
  onContentChange?: (value: Descendant[]) => void;
  onFileLoad?: (value: Descendant[]) => void;
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

export const MyEditor: React.FC<MyEditorProps> = ({ fileText, onContentChange, onFileLoad }) => {
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