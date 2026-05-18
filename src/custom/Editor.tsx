import React, { useState } from "react";
import { createEditor, Descendant } from "slate";
import { Slate, withReact } from "slate-react";
import TextEditor from "./advancedEditor";
// @ts-ignore: Allow side-effect CSS import without type declarations


type CustomText = {
  text: string;
};

type HeadingOneElement = {
  type: 'heading-one';
  children: CustomText[];
};

type ParagraphElement = {
  type: 'paragraph';
  children: CustomText[];
};

type CustomDescendant = HeadingOneElement | ParagraphElement | CustomText;



const initialValue: CustomDescendant[] = [
  {
    type: 'heading-one',
    children: [{ text: 'This is a heading' }],
  },
  {
    type: 'paragraph',
    children: [{ text: 'This is a simple rich text editor built with Slate.js. You can start typing here...' }],
  }
  
]

export const MyEditor = () => {
  const [editor] = useState(() => withReact(createEditor()))
  // Render the Slate context.
 return (
    // Add the editable component inside the context.
    <Slate editor={editor} initialValue={initialValue}>
      <TextEditor editor={editor} />
    </Slate>
  )
}