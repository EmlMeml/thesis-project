import { useCallback } from "react";
import { Editor, Transforms, Text } from "slate";
import { Editable } from "slate-react";
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

  const onKeyDown = (event) => {
    if (!event.ctrlKey) {
      return;
    }

    event.preventDefault(); // prevents default browser behaviour

    switch (event.key) {
      case "b": {
        changeMark("bold");
        break;
      }

      case "i": {
        changeMark("italic");
        break;
      }

      case "u": {
        changeMark("underline");
        break;
      }
      default: {
        break;
      }
    }
  };
  return <Editable onKeyDown={onKeyDown} renderLeaf={renderLeaf} />;
}

export default TextEditor;