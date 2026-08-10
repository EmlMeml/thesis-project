import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'

type CustomElement = {
  type: 'paragraph' | 'heading-one' | 'heading-two';
  paragraphKey: string;
  children: CustomText[];
  diff?: {
    key: string;
    oldText: string;
    newText: string;
  };
};
export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};


declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}
