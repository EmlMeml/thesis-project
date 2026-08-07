import { useCallback, useEffect, useState } from "react";
import { Editor, Transforms, Text, Range, Element as SlateElement } from "slate";
import { Editable } from "slate-react";
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
import FileUploader from "./../custom/FileUploader.tsx";
import { InlineTextDiff } from "./TextDiff.tsx";

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

function TextEditor({ editor, activeSegmentText = "", onFileLoad }) {
  const [flashText, setFlashText] = useState("");
  useEffect(() => {
    if (!activeSegmentText) return;
    setFlashText(activeSegmentText);
    const t = setTimeout(() => setFlashText(""), 1000);
    return () => clearTimeout(t);
  }, [activeSegmentText]);
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
    const textContent = props.element.children
      .map((child) => child.text || '')
      .join('')
      .trim();

    const highlightStyle =
      props.element.type === 'paragraph' && textContent === flashText
        ? { backgroundColor: '#89aac3', transition: 'background-color 4s ease' }
        : { backgroundColor: 'transparent', transition: 'background-color 4s ease' };

    if (props.element.diff) {
      return (
        <div {...props.attributes} style={{ ...highlightStyle, marginBottom: 8, padding: 8, borderRadius: 6, backgroundColor: 'transparent' }}>
          <InlineTextDiff oldText={props.element.diff.oldText} newText={props.element.diff.newText} />
        </div>
      );
    }

    switch (props.element.type) {
        case 'heading-one':
        return <h1 {...props.attributes} style={highlightStyle}>{props.children}</h1>;
        case 'heading-two':
        return <h2 {...props.attributes} style={highlightStyle}>{props.children}</h2>;
        default:
        return <p {...props.attributes} style={highlightStyle}>{props.children}</p>;
    }
}, [flashText]); 

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
                backgroundColor: "#dfe8ef",
                color: "#000000",
                textAlign: "start",
                width:"70%",
                height: "740px",
                minHeight: "500px",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #cad9e4",
                boxShadow: "0 2px 4px #cad9e4",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box"
            }}
        >           
  <div style={{ display: "flex", backgroundColor: "#dfe8ef", marginBottom: "4px", flexShrink: 0 }}>

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
    <FileUploader onTextLoad={onFileLoad} />
  </div>
  <Editable className="editorEditable" style={{ flex: 1, minHeight: 0 }} onFileLoad={onFileLoad} onKeyDown={onKeyDown} onPaste={onPaste} renderLeaf={renderLeaf} renderElement={renderElement} placeholder="Begin your Story..."/>
</div>;
}

export default TextEditor;