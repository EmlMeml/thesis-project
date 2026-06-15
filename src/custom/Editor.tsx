import React, { useState } from "react";
import { createEditor, Descendant } from "slate";
import { Slate, withReact } from "slate-react";
import TextEditor from "./advancedEditor";
// @ts-ignore: Allow side-effect CSS import without type declarations

interface MyEditorProps {
  onContentChange?: (value: Descendant[]) => void;
}

const initialValue = [
  {
    type: 'heading-one',
    children: [{ text: 'This is a heading' }],
  },
  {
    type: 'paragraph',
    children: [{ text: 'This is a simple rich text editor built with Slate.js. You can start typing here...' }],
  }
] as unknown as Descendant[];

export const MyEditor: React.FC<MyEditorProps> = ({ onContentChange }) => {
  const [editor] = useState(() => withReact(createEditor()));
  const [value, setValue] = useState<Descendant[]>(initialValue);

  const handleChange = (newValue: Descendant[]) => {
    setValue(newValue);
    onContentChange?.(newValue);
  };

  return (
    <Slate
      editor={editor}
      initialValue={initialValue}
      onChange={handleChange}
    >
      <TextEditor editor={editor} />
    </Slate>
  );
};