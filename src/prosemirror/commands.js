

import { undo, redo } from "prosemirror-history"

import { markIsActive, nodeIsActive } from 'tiptap-utils'

import { toggleMark } from "prosemirror-commands"
import { toggleList, toggleBlockType } from 'tiptap-commands'



class Command {

  // eslint-disable-next-line
  isEnabled(state) {
    throw new Error('Commands must implement isEnabled');
  }

  // eslint-disable-next-line
  isLatched(state) {
    return false;
  }

  // eslint-disable-next-line
  execute(state, dispatch, view) {
    throw new Error('Commands must implement execute');
  }
}

class ProsemirrorCommand extends Command {

  constructor(command) {
    super();
    this._command = command;
  }

  isEnabled(state) {
    return this._command(state);
  }

  execute(state, dispatch, view) {
    return this._command(state, dispatch, view);
  }
}

class MarkCommand extends ProsemirrorCommand {
  
  constructor(markType, attrs = {}) {
    super(toggleMark(markType, attrs));
    this._markType = markType;
    this._attrs = attrs;
  }

  isLatched(state) {
    return markIsActive(state, this._markType, this._attrs);
  }

}

class NodeCommand extends ProsemirrorCommand {

  constructor(nodeType, command) {
    super(command);
    this._nodeType = nodeType;
  }

  isLatched(state) {
    return nodeIsActive(state, this._nodeType);
  }

}

class ListCommand extends NodeCommand {

  constructor(listType, itemType) {
    super(listType, toggleList(listType, itemType));
  }

}

class BlockCommand extends NodeCommand {

  constructor(blockType, toggleType, attrs = {}) {
    super(blockType, toggleBlockType(blockType, toggleType, attrs));
  }

}


export function buildCommands(schema) {
  return {
    undo: new ProsemirrorCommand(undo),
    redo: new ProsemirrorCommand(redo),
    strong: new MarkCommand(schema.marks.strong),
    em: new MarkCommand(schema.marks.em),
    code: new MarkCommand(schema.marks.code),
    bullet_list: new ListCommand(schema.nodes.bullet_list,
                                 schema.nodes.list_item),
    ordered_list: new ListCommand(schema.nodes.ordered_list,
                                  schema.nodes.list_item),
    blockquote: new BlockCommand(schema.nodes.blockquote),
    heading1: new BlockCommand(schema.nodes.heading, { level: 1 }),
    heading2: new BlockCommand(schema.nodes.heading, { level: 2 }),
    heading3: new BlockCommand(schema.nodes.heading, { level: 3 })
  }
}

