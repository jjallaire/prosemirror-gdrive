

import { undo, redo } from "prosemirror-history"

import { markIsActive, nodeIsActive } from 'tiptap-utils'

import { toggleMark } from "prosemirror-commands"
import { toggleList, toggleBlockType, toggleWrap } from 'tiptap-commands'

import { Command } from '../core/command'


class EditorCommand extends Command {

  constructor(title, command) {
    super(title);
    this._command = command;
  }

  isEnabled(state) {
    return this._command(state);
  }

  execute(state, dispatch, view) {
    return this._command(state, dispatch, view);
  }
}

class MarkCommand extends EditorCommand {
  
  constructor(title, markType, attrs = {}) {
    super(title, toggleMark(markType, attrs));
    this._markType = markType;
    this._attrs = attrs;
  }

  isLatched(state) {
    return markIsActive(state, this._markType, this._attrs);
  }

}

class NodeCommand extends EditorCommand {

  constructor(title, nodeType, command) {
    super(title, command);
    this._nodeType = nodeType;
  }

  isLatched(state) {
    return nodeIsActive(state, this._nodeType);
  }

}

class ListCommand extends NodeCommand {

  constructor(title, listType, itemType) {
    super(title, listType, toggleList(listType, itemType));
  }

}

class BlockCommand extends NodeCommand {

  constructor(title, blockType, toggleType, attrs = {}) {
    super(title, blockType, toggleBlockType(blockType, toggleType, attrs));
  }

}

class HeadingCommand extends BlockCommand {
  constructor(schema, level) {
    super(
      "Level " + level + "Heading", 
      schema.nodes.heading, 
      schema.nodes.paragraph,
      { level }
    )
  }
}

class WrapCommand extends NodeCommand {
  constructor(title, wrapType, toggleType, attrs = {}) {
    super(title, wrapType, toggleWrap(wrapType, toggleType, attrs));
  }
}


export function buildEditorCommands(schema) {
  return {
    undo: new EditorCommand("Undo", undo),
    redo: new EditorCommand("Redo", redo),
    strong: new MarkCommand("Bold", schema.marks.strong),
    em: new MarkCommand("Italics", schema.marks.em),
    code: new MarkCommand("Code", schema.marks.code),
    bullet_list: new ListCommand("Bullet List", 
                                 schema.nodes.bullet_list,
                                 schema.nodes.list_item),
    ordered_list: new ListCommand("Numbered List",
                                  schema.nodes.ordered_list,
                                  schema.nodes.list_item),
    blockquote: new WrapCommand("Blockquote", schema.nodes.blockquote, schema.nodes.paragraph),
    heading1: new HeadingCommand(schema, 1),
    heading2: new HeadingCommand(schema, 2),
    heading3: new HeadingCommand(schema, 3)
  }
}

