import React, { useState } from "react";
import {createEditor} from "slate";
import {Slate, Editable, withReact} from "slate-react";
import { Descendant } from 'slate'
import './../App.css';


const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: 'This is a simple rich text editor built with Slate.js. You can start typing here...' }],
  },
]

export const MyEditor = () => {
  const [editor] = useState(() => withReact(createEditor()))
  // Render the Slate context.
 return (
    // Add the editable component inside the context.
    <Slate editor={editor} initialValue={initialValue}>
      <Editable className="editorEditable" placeholder="Type here..." />
    </Slate>
  )
}