import { useCallback } from "react";
import { Editor, Transforms, Text, Range, Element as SlateElement } from "slate";
import { Editable, ReactEditor } from "slate-react";
import { IconButton } from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  ContentCopy,
  ContentPaste,
  BorderColor
} from "@mui/icons-material";
import './../css/App.css';
import './../css/wave-test.css';
import { makeAWave, stopAnimation } from "../animation.js";

const Leaf = (props) => {
  return (
    <span
      {...props.attributes}
      style={{
        fontWeight: props.leaf.bold ? "bold" : "normal",
        fontStyle: props.leaf.italic ? "italic" : "normal",
        textDecoration: props.leaf.underline ? "underline" : "none"
      }}
    >
      {props.children}
    </span>
  );
};

function TextEditor({ editor }) {
  function changeMark(mark) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n[mark] // check for existing formatting
    });

    console.log('changeMark existing match:', !!match);
    Transforms.setNodes(
      editor,
      { [mark]: !match }, // sets the formatting value
      { match: (n) => Text.isText(n), split: true }
    );
  }

  const renderElement = useCallback((props) => {
    switch (props.element.type) {
        case 'heading-one':
        return <h1 {...props.attributes}>{props.children}</h1>;
        case 'heading-two':
        return <h2 {...props.attributes}>{props.children}</h2>;
        default:
        return <p {...props.attributes}>{props.children}</p>;
    }
}, []); 

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  const onPaste = (event) => {
    event.preventDefault();
    const clipboardText = event.clipboardData?.getData("text/plain");
    if (!clipboardText) {
      return;
    }
    Transforms.insertText(editor, clipboardText);
  };

  const pasteFromClipboard = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (!clipboardText) {
        return;
      }
      Transforms.insertText(editor, clipboardText);
    } catch (error) {
      console.error("Paste failed", error);
    }
  };

  const copySelectedText = async () => {
    try {
      const { selection } = editor;
      let selectedText = "";

      if (selection && !Range.isCollapsed(selection)) {
        selectedText = Editor.string(editor, selection);
      } else {
        selectedText = window.getSelection()?.toString() || "";
      }

      if (!selectedText) {
        return;
      }
      await navigator.clipboard.writeText(selectedText);
    } catch (error) {
      console.error("Copy failed", error);
    }
  };

  const toggleBlock = (type) => {
    if (!editor.selection) {
      return;
    }

    const match = Editor.above(editor, {
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && Editor.isBlock(editor, n),
    });

    if (!match) {
      return;
    }

    const [, path] = match;
    Transforms.setNodes(editor, { type }, { at: path });
  };

  const onKeyDown = (event) => {
    if (!event.ctrlKey) {
      return;
    }

    switch (event.key) {
      case "b": {
        event.preventDefault();
        changeMark("bold");
        break;
      }

      case "i": {
        event.preventDefault();
        changeMark("italic");
        break;
      }

      case "u": {
        event.preventDefault();
        changeMark("underline");
        break;
      }

      default: {
        return;
      }
    }
  };
  return <div
            style={{
                backgroundColor: "#e3ebf5",
                color: "#000000",
                textAlign: "start",
                width:"70%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #d6d6d6",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
            }}
        >
              
  <div style={{ display: `flex`, backgroundColor: "#e3ebf5",marginBottom: "4px"}}>

    <IconButton style={{ color: "#1a2040" }} onPointerDown={(e) => {changeMark("bold");}}>
      <FormatBold />
    </IconButton>

    <IconButton style={{ color: "#1a2040" }} onPointerDown={(e) => {changeMark("italic");}}>
      <FormatItalic />
    </IconButton>

    <IconButton style={{ color: "#1a2040" }} onPointerDown={(e) => {changeMark("underline");}}>
      <FormatUnderlined />
    </IconButton>

    <IconButton style={{ color: "#1a2040" }} onClick={copySelectedText}>
      <ContentCopy />
    </IconButton>

    <IconButton style={{ color: "#1a2040" }} onClick={pasteFromClipboard}>
      <ContentPaste />
    </IconButton>
    <button className="toolbarButton" onPointerDown={(event) => { event.preventDefault(); toggleBlock('heading-one'); }}>Titel</button>
    <button className="toolbarButton" onPointerDown={(event) => { event.preventDefault(); toggleBlock('heading-two'); }}>Subtitel</button>
    <button className="toolbarButton" onPointerDown={(event) => { event.preventDefault(); toggleBlock('paragraph'); }}>Paragraph</button>
    <button className="toolbarButton" onPointerDown={() => makeAWave()}>Make A Wave!</button>
    <button className="toolbarButton" onPointerDown={() => stopAnimation()}>Stop Animation</button>

  </div>
  <Editable className="editorEditable" onKeyDown={onKeyDown} onPaste={onPaste} renderLeaf={renderLeaf} renderElement={renderElement} placeholder="Begin your Story..."/>
</div>;
}

export default TextEditor;