import React, { useState } from "react";
import {createEditor} from "slate";
import {Slate, Editable, withReact} from "slate-react";
import { Descendant } from 'slate'

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },
]

export const MyEditor = () => {
  const [editor] = useState(() => withReact(createEditor()))
  // Render the Slate context.
 return (
    // Add the editable component inside the context.
    <Slate editor={editor} initialValue={initialValue}>
      <Editable />
    </Slate>
  )
}