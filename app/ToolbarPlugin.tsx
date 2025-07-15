'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SELECTION_CHANGE_COMMAND, FORMAT_TEXT_COMMAND, $getSelection, $isRangeSelection, $createRangeSelection, CLEAR_HISTORY_COMMAND } from 'lexical';
import { FaBold, FaItalic, FaUnderline, FaStrikethrough, FaCode, FaEraser } from 'react-icons/fa';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $isListNode, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND } from '@lexical/list';
import { $isHeadingNode } from '@lexical/rich-text';
import { $isCodeNode, get  } from '@lexical/code';
import { $isDecoratorNode } from 'lexical';
import { $isTableNode } from '@lexical/table';
import { $isParagraphNode } from 'lexical';
import { $isLineBreakNode } from 'lexical';
import { $isTextNode } from 'lexical';
import { $isElementNode } from 'lexical';
import { $isRootNode } from 'lexical';
import { $isBlockNode } from 'lexical';
import { $isLeafNode } from 'lexical';
import { $isNodeSelection } from 'lexical';
import { $isGridSelection } from 'lexical';
import { $isTableSelection } from '@lexical/table';
import { $isTableSelection as $isTableSelectionLexical } from '@lexical/table';
import { $isTableNode as $isTableNodeLexical } from '@lexical/table';
import { $isTableRowNode } from '@lexical/table';
import { $isTableCellNode } from '@lexical/table';
import { $isTableElementNode } from '@lexical/table';
import { $isTableTextNode } from '@lexical/table';
import { $isTableContentNode } from '@lexical/table';
import { $isTableContainerNode } from '@lexical/table';
import { $isTableBodyNode } from '@lexical/table';
import { $isTableHeadNode } from '@lexical/table';
import { $isTableFootNode } from '@lexical/table';
import { $isTableCaptionNode } from '@lexical/table';
import { $isTableColumnGroupNode } from '@lexical/table';
import { $isTableColumnNode } from '@lexical/table';
import { $isTableColNode } from '@lexical/table';
import { $isTableColgroupNode } from '@lexical/table';
import { $isTableSectionNode } from '@lexical/table';
import { $isTableSectionElementNode } from '@lexical/table';
import { $isTableSectionTextNode } from '@lexical/table';
import { $isTableSectionContentNode } from '@lexical/table';
import { $isTableSectionContainerNode } from '@lexical/table';
import { $isTableSectionBodyNode } from '@lexical/table';
import { $isTableSectionHeadNode } from '@lexical/table';
import { $isTableSectionFootNode } from '@lexical/table';
import { $isTableSectionCaptionNode } from '@lexical/table';
import { $isTableSectionColumnGroupNode } from '@lexical/table';
import { $isTableSectionColumnNode } from '@lexical/table';
import { $isTableSectionColNode } from '@lexical/table';
import { $isTableSectionColgroupNode } from '@lexical/table';
import { $isTableSectionSectionNode } from '@lexical/table';
import { $isTableSectionSectionElementNode } from '@lexical/table';
import { $isTableSectionSectionTextNode } from '@lexical/table';
import { $isTableSectionSectionContentNode } from '@lexical/table';
import { $isTableSectionSectionContainerNode } from '@lexical/table';
import { $isTableSectionSectionBodyNode } from '@lexical/table';
import { $isTableSectionSectionHeadNode } from '@lexical/table';
import { $isTableSectionSectionFootNode } from '@lexical/table';
import { $isTableSectionSectionCaptionNode } from '@lexical/table';
import { $isTableSectionSectionColumnGroupNode } from '@lexical/table';
import { $isTableSectionSectionColumnNode } from '@lexical/table';
import { $isTableSectionSectionColNode } from '@lexical/table';
import { $isTableSectionSectionColgroupNode } from '@lexical/table';

const LowPriority = 1;

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsCode(selection.hasFormat('code'));
    }
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        updateToolbar();
        return false;
      },
      LowPriority
    );
  }, [editor, updateToolbar]);

  return (
    <div className="toolbar">
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        className={isBold ? 'active' : ''}
      >
        <FaBold />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
        className={isItalic ? 'active' : ''}
      >
        <FaItalic />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
        className={isUnderline ? 'active' : ''}
      >
        <FaUnderline />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
        }}
        className={isStrikethrough ? 'active' : ''}
      >
        <FaStrikethrough />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
        }}
        className={isCode ? 'active' : ''}
      >
        <FaCode />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'clear');
        }}
      >
        <FaEraser />
      </button>
    </div>
  );
}

export default ToolbarPlugin;
