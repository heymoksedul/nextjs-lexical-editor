"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"; // Corrected import
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import ToolbarPlugin from "./ToolbarPlugin";

const editorTheme = {
  root: "editor-root",
  ltr: "ltr",
  rtl: "rtl",
  placeholder: "editor-placeholder",
  paragraph: "editor-paragraph",
  heading: {
    h1: "editor-heading-h1",
    h2: "editor-heading-h2",
    h3: "editor-heading-h3",
    h4: "editor-heading-h4",
    h5: "editor-heading-h5",
    h6: "editor-heading-h6",
  },
  text: {
    bold: "editor-text-bold",
    italic: "editor-text-italic",
    underline: "editor-text-underline",
    strikethrough: "editor-text-strikethrough",
    underlineStrikethrough: "editor-text-underlineStrikethrough",
    code: "editor-text-code",
    subscript: "editor-text-subscript",
    superscript: "editor-text-superscript",
  },
  list: {
    nested: {
      listitem: "editor-nested-listitem",
    },
    ol: "editor-list-ol",
    ul: "editor-list-ul",
    listitem: "editor-listitem",
  },
  link: "editor-link",
  quote: "editor-quote",
  code: "editor-code",
  // Add other editor theme styles here as needed
};

// When the editor changes, you can get notified via the onChange prop.
function OnChangePlugin({ setHtml }: { setHtml: (html: string) => void }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        setHtml($generateHtmlFromNodes(editor, null));
      });
    });
  }, [editor, setHtml]);
  return null;
}

// Lexical React plugins are simple React components that handle some editor functionality.
// They enable you to tie into Lexical's editor lifecycle hooks.
function MyCustomAutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Focus the editor when the editor is initially loaded and the contents become editable.
    editor.focus();
  }, [editor]);

  return null;
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
  console.error(error);
}

import { CodeNode } from "@lexical/code";
import { $generateHtmlFromNodes } from "@lexical/html";
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table"; // Corrected import
import { LineBreakNode, ParagraphNode, TextNode } from "lexical";
import { useEffect, useState } from "react";

export function LexicalEditor() {
  const [html, setHtml] = useState<string | null>(null);
  const initialConfig = {
    namespace: "MyEditor",
    theme: editorTheme,
    onError,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      LinkNode,
      ParagraphNode,
      LineBreakNode,
      TextNode,
    ],
    editorState: null, // Added
    editable: true, // Added
  };

  return (
    <>
      <div className="editor-wrapper">
        <LexicalComposer initialConfig={initialConfig}>
          <ToolbarPlugin />
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="editor-content-editable" />
            }
            placeholder={
              <div className="editor-placeholder">Enter some text...</div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <MyCustomAutoFocusPlugin />
          <OnChangePlugin setHtml={setHtml} />
        </LexicalComposer>
      </div>
      <div className="html-preview w-full">
        <h3>HTML Preview</h3>
        <textarea
          className="html-textarea"
          value={html || ""}
          readOnly
          rows={10}
        />
      </div>
    </>
  );
}
