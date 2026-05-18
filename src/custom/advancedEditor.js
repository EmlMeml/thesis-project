import { useCallback } from "react";
import { Editor, Transforms, Text } from "slate";
import { Editable } from "slate-react";
import { IconButton } from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
} from "@mui/icons-material";
import './../App.css';


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

    Transforms.setNodes(
      editor,
      { [mark]: !match }, // sets the formatting value
      { match: (n) => Text.isText(n), split: true }
    );
  }

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
                backgroundColor: "rgb(228, 228, 228)",
                color: "#000000",
                textAlign: "start",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #d6d6d6",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
            }}
        >
              
  <div style={{ display: `flex`, backgroundColor: "rgb(228, 228, 228)" }}>

    <IconButton style={{ color: "grey" }} onPointerDown={(e) => {changeMark("bold");}}>
      <FormatBold />
    </IconButton>

    <IconButton style={{ color: "grey" }} onPointerDown={(e) => {changeMark("italic");}}>
      <FormatItalic />
    </IconButton>

    <IconButton style={{ color: "grey" }} onPointerDown={(e) => {changeMark("underline");}}>
      <FormatUnderlined />
    </IconButton>

  </div>
  <Editable className="editorEditable" onKeyDown={onKeyDown} onPaste={onPaste} renderLeaf={renderLeaf} placeholder="Begin your Story..."/>
</div>;
}

export default TextEditor;