

import { undo, redo } from "prosemirror-history"

import { markIsActive, nodeIsActive } from 'tiptap-utils'

import { toggleMark } from "prosemirror-commands"
import { toggleList, toggleBlockType, toggleWrap } from 'tiptap-commands'

import { Command } from '../core/command'


class EditorCommand extends Command {

  constructor(name, icon, title, command) {
    super(name, icon, title);
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
  
  constructor(name, icon, title, markType, attrs = {}) {
    super(name, icon, title, toggleMark(markType, attrs));
    this._markType = markType;
    this._attrs = attrs;
  }

  isLatched(state) {
    return markIsActive(state, this._markType, this._attrs);
  }

}

class NodeCommand extends EditorCommand {

  constructor(name, icon, title, nodeType, attrs, command) {
    super(name, icon, title, command);
    this._nodeType = nodeType;
    this._attrs = attrs;
  }

  isLatched(state) {
    return nodeIsActive(state, this._nodeType, this._attrs);
  }

}

class ListCommand extends NodeCommand {

  constructor(name, icon, title, schema, listType) {
    super(name, icon, title, listType, {}, toggleList(listType, schema.nodes.list_item));
  }

}

class BlockCommand extends NodeCommand {

  constructor(name, icon, title, blockType, toggleType, attrs = {}) {
    super(name, icon, title, blockType, attrs, toggleBlockType(blockType, toggleType, attrs));
  }

}

class HeadingCommand extends BlockCommand {
  constructor(name, icon, schema, level) {
    super(
      name,
      icon,
      "Level " + level + "Heading", 
      schema.nodes.heading, 
      schema.nodes.paragraph,
      { level }
    )
  }
}

class WrapCommand extends NodeCommand {
  constructor(name, icon, title, wrapType, toggleType, attrs = {}) {
    super(name, icon, title, wrapType, {}, toggleWrap(wrapType, toggleType, attrs));
  }
}

export class EditorCommandAdaptor extends Command {
      
  constructor(command, state, view) {
    super(command.name, command.icon, command.title)
    this._command = command;
    this._state = state;
    this._view = view;
  }

  isEnabled() {
    return this._command.isEnabled(this._state);
  }

  isLatched() {
    return this._command.isLatched(this._state);
  }

  execute() {
    this._view.focus();
    return this._command.execute(this._state, this._view.dispatch, this._view);
  }
}



export function buildCommands(schema) {
  return [
    new EditorCommand("undo", "undo", "Undo", undo),
    new EditorCommand("redo", "redo", "Redo", redo),
    new MarkCommand("strong", "format_bold", "Bold", schema.marks.strong),
    new MarkCommand("em", "format_italic", "Italics", schema.marks.em),
    new MarkCommand("code", "code", "Code", schema.marks.code),
    new MarkCommand("underline", "format_underlined", "Underline", schema.marks.underline),
    new MarkCommand("strikethrough", "format_strikethrough", "Strikethrough", schema.marks.strikethrough),
    new ListCommand("bullet_list", "list", "Bullet List", schema, schema.nodes.bullet_list),
    new ListCommand("ordered_list", "format_list_numbered", "Numbered List", schema, schema.nodes.ordered_list),
    new WrapCommand("blockquote", "format_quote", "Blockquote", schema.nodes.blockquote, schema.nodes.paragraph),
    new BlockCommand("paragraph", "subject", "Paragraph", schema.nodes.paragraph, schema.nodes.paragraph, {}),
    new BlockCommand("code_block", "code", "Code Block", schema.nodes.code_block, schema.nodes.paragraph, {}),
    new HeadingCommand("heading1", "exposure_plus_1", schema, 1),
    new HeadingCommand("heading2", "exposure_plus_2", schema, 2),
  ]
}

