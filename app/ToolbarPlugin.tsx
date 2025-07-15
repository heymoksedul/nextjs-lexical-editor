"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createHeadingNode,
  $isHeadingNode,
  HeadingTagType,
} from "@lexical/rich-text";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isRootNode,
  $isTextNode,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FaAlignCenter,
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight,
  FaBold,
  FaCode,
  FaItalic,
  FaMinus,
  FaPlus,
  FaStrikethrough,
  FaUnderline,
} from "react-icons/fa";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const LowPriority = 1;

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isAlignLeft, setIsAlignLeft] = useState(false);
  const [isAlignCenter, setIsAlignCenter] = useState(false);
  const [isAlignRight, setIsAlignRight] = useState(false);
  const [isAlignJustify, setIsAlignJustify] = useState(false);
  const [blockType, setBlockType] = useState("paragraph");
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("Default");
  const fontFamilies = [
    "Default",
    "Arial",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Verdana",
    "Tahoma",
    "Trebuchet MS",
    "Impact",
    "Comic Sans MS",
  ];
  const fontSizeInputRef = useRef<HTMLInputElement>(null);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsCode(selection.hasFormat("code"));

      const anchorNode = selection.anchor.getNode();
      if ($isRootNode(anchorNode)) {
        setBlockType("paragraph");
        return;
      }
      const element = anchorNode.getTopLevelElementOrThrow();

      const format = element.getFormatType();
      setIsAlignLeft(format === "left");
      setIsAlignCenter(format === "center");
      setIsAlignRight(format === "right");
      setIsAlignJustify(format === "justify");

      // Detect block type for heading dropdown
      if ($isHeadingNode(element)) {
        setBlockType(element.getTag());
      } else {
        setBlockType(element.getType());
      }

      // Font size detection
      const nodes = selection.getNodes();
      let detectedSize: number | null = null;
      let detectedFamily: string | null = null;
      nodes.forEach((node) => {
        if ($isTextNode(node)) {
          const style = node.getStyle();
          const match = style.match(/font-size:\s*(\d+)px/);
          const size = match ? parseInt(match[1]) : 16;
          if (detectedSize === null) {
            detectedSize = size;
          } else if (detectedSize !== size) {
            detectedSize = 16; // Mixed sizes, show default
          }
          const famMatch = style.match(/font-family:\s*([^;]+);?/);
          const fam = famMatch ? famMatch[1].replace(/['"]/g, "") : "Default";
          if (detectedFamily === null) {
            detectedFamily = fam;
          } else if (detectedFamily !== fam) {
            detectedFamily = "Default"; // Mixed, show default
          }
        }
      });
      setFontSize(detectedSize ?? 16);
      setFontFamily(detectedFamily ?? "Default");
    }
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload: any, newEditor: any) => {
        updateToolbar();
        return false;
      },
      LowPriority
    );
  }, [editor, updateToolbar]);

  return (
    <div className="toolbar">
      {/* Heading Dropdown */}
      <Select
        value={blockType}
        onValueChange={(value) => {
          if (value === "paragraph") {
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                const anchorNode = selection.anchor.getNode();
                if ($isRootNode(anchorNode)) {
                  // Prevent error if selection is at root
                  return;
                }
                const element = anchorNode.getTopLevelElementOrThrow();
                const paragraphNode = $createParagraphNode();
                while (element.getChildren().length > 0) {
                  paragraphNode.append(element.getChildren()[0]);
                }
                element.replace(paragraphNode);
                paragraphNode.select();
              }
            });
          } else if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(value)) {
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                const anchorNode = selection.anchor.getNode();
                if ($isRootNode(anchorNode)) {
                  // Prevent error if selection is at root
                  return;
                }
                const element = anchorNode.getTopLevelElementOrThrow();
                const newHeading = $createHeadingNode(value as HeadingTagType);
                while (element.getChildren().length > 0) {
                  newHeading.append(element.getChildren()[0]);
                }
                element.replace(newHeading);
                newHeading.select();
              }
            });
          }
        }}
      >
        <SelectTrigger className="w-[140px] mr-2">
          <SelectValue placeholder="Heading" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="paragraph">Normal</SelectItem>
          <SelectItem value="h1">Heading 1</SelectItem>
          <SelectItem value="h2">Heading 2</SelectItem>
          <SelectItem value="h3">Heading 3</SelectItem>
          <SelectItem value="h4">Heading 4</SelectItem>
          <SelectItem value="h5">Heading 5</SelectItem>
          <SelectItem value="h6">Heading 6</SelectItem>
        </SelectContent>
      </Select>
      {/* Font size controls */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          editor.update(() => {
            const selection = $getSelection();
            let newDetectedSize = 16;
            if ($isRangeSelection(selection)) {
              const nodes = selection.getNodes();
              nodes.forEach((node) => {
                if ($isTextNode(node)) {
                  const style = node.getStyle();
                  const match = style.match(/font-size:\s*(\d+)px/);
                  const currentSize = match ? parseInt(match[1]) : 16;
                  const newSize = Math.min(currentSize + 2, 48);
                  let newStyle = style.replace(/font-size:\s*\d+px;?/g, "");
                  newStyle = `font-size: ${newSize}px;` + newStyle;
                  node.setStyle(newStyle.trim());
                  newDetectedSize = newSize;
                }
              });
            }
            setFontSize(newDetectedSize);
          });
        }}
        title="Increase font size"
        className="mr-1"
      >
        <FaPlus />
      </Button>
      <Input
        ref={fontSizeInputRef}
        type="number"
        min={8}
        max={48}
        value={fontSize}
        onChange={(e) => {
          const newSize = Math.max(
            8,
            Math.min(48, parseInt(e.target.value) || 16)
          );
          setFontSize(newSize);
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              const nodes = selection.getNodes();
              nodes.forEach((node) => {
                if ($isTextNode(node)) {
                  const style = node.getStyle();
                  let newStyle = style.replace(/font-size:\s*\d+px;?/g, "");
                  newStyle = `font-size: ${newSize}px;` + newStyle;
                  node.setStyle(newStyle.trim());
                }
              });
            }
          });
          // Blur the input after change
          if (fontSizeInputRef.current) {
            fontSizeInputRef.current.blur();
          }
        }}
        className="w-16 text-center mx-1"
        title="Font size (px)"
      />
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          editor.update(() => {
            const selection = $getSelection();
            let newDetectedSize = 16;
            if ($isRangeSelection(selection)) {
              const nodes = selection.getNodes();
              nodes.forEach((node) => {
                if ($isTextNode(node)) {
                  const style = node.getStyle();
                  const match = style.match(/font-size:\s*(\d+)px/);
                  const currentSize = match ? parseInt(match[1]) : 16;
                  const newSize = Math.max(currentSize - 2, 8);
                  let newStyle = style.replace(/font-size:\s*\d+px;?/g, "");
                  newStyle = `font-size: ${newSize}px;` + newStyle;
                  node.setStyle(newStyle.trim());
                  newDetectedSize = newSize;
                }
              });
            }
            setFontSize(newDetectedSize);
          });
        }}
        title="Decrease font size"
        className="mr-2"
      >
        <FaMinus />
      </Button>
      {/* Font family dropdown */}
      <Select
        value={fontFamily}
        onValueChange={(newFamily) => {
          setFontFamily(newFamily);
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              const nodes = selection.getNodes();
              nodes.forEach((node) => {
                if ($isTextNode(node)) {
                  const style = node.getStyle();
                  let newStyle = style.replace(/font-family:\s*[^;]+;?/g, "");
                  if (newFamily !== "Default") {
                    newStyle = `font-family: '${newFamily}';` + newStyle;
                  }
                  node.setStyle(newStyle.trim());
                }
              });
            }
          });
        }}
      >
        <SelectTrigger
          className="w-[140px] mr-2"
          style={{
            fontFamily: fontFamily !== "Default" ? fontFamily : undefined,
          }}
        >
          <SelectValue placeholder="Font family" />
        </SelectTrigger>
        <SelectContent>
          {fontFamilies.map((fam) => (
            <SelectItem
              key={fam}
              value={fam}
              style={{ fontFamily: fam !== "Default" ? fam : undefined }}
            >
              {fam}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant={isBold ? "default" : "outline"}
        size="icon"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        className="mr-1"
      >
        <FaBold />
      </Button>
      <Button
        variant={isItalic ? "default" : "outline"}
        size="icon"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        className="mr-1"
      >
        <FaItalic />
      </Button>
      <Button
        variant={isUnderline ? "default" : "outline"}
        size="icon"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
        className="mr-1"
      >
        <FaUnderline />
      </Button>
      <Button
        variant={isStrikethrough ? "default" : "outline"}
        size="icon"
        onClick={() =>
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
        }
        className="mr-1"
      >
        <FaStrikethrough />
      </Button>
      <Button
        variant={isCode ? "default" : "outline"}
        size="icon"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code")}
        className="mr-1"
      >
        <FaCode />
      </Button>
      <Button
        variant={isAlignLeft ? "default" : "outline"}
        size="icon"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}
        className="mr-1"
      >
        <FaAlignLeft />
      </Button>
      <Button
        variant={isAlignCenter ? "default" : "outline"}
        size="icon"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}
        className="mr-1"
      >
        <FaAlignCenter />
      </Button>
      <Button
        variant={isAlignRight ? "default" : "outline"}
        size="icon"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}
        className="mr-1"
      >
        <FaAlignRight />
      </Button>
      <Button
        variant={isAlignJustify ? "default" : "outline"}
        size="icon"
        onClick={() =>
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")
        }
        className="mr-2"
      >
        <FaAlignJustify />
      </Button>
    </div>
  );
}

export default ToolbarPlugin;
