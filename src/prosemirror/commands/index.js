

import { undo, redo } from "prosemirror-history"

import { markIsActive, nodeIsActive } from 'tiptap-utils'

import { toggleMark } from "prosemirror-commands"
import { toggleList, toggleBlockType, toggleWrap } from 'tiptap-commands'

import { linkCommand } from './link.js'
import { insertCommand } from './insert.js'

import { imageCommand } from '../plugins/image.js'


export class EditorCommand {

  constructor(name, icon, title) {
    this.name = name;
    this.icon = icon;
    this.title = title;
  }

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

class ProsemirrorCommand extends EditorCommand {

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

class MarkCommand extends ProsemirrorCommand {
  
  constructor(name, icon, title, markType, attrs = {}) {
    super(name, icon, title, toggleMark(markType, attrs));
    this._markType = markType;
    this._attrs = attrs;
  }

  isLatched(state) {
    return markIsActive(state, this._markType, this._attrs);
  }

}

class NodeCommand extends ProsemirrorCommand {

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
  constructor(schema, level) {
    super(
      "heading" + level,
      null,
      "Heading " + level, 
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

export function buildCommands(schema, hooks) {
  return [
    new ProsemirrorCommand("undo", "undo", "Undo", undo),
    new ProsemirrorCommand("redo", "redo", "Redo", redo),
    new MarkCommand("strong", "format_bold", "Bold", schema.marks.strong),
    new MarkCommand("em", "format_italic", "Italics", schema.marks.em),
    new MarkCommand("code", "code", "Code", schema.marks.code),
    new MarkCommand("underline", "format_underlined", "Underline", schema.marks.underline),
    new MarkCommand("strikethrough", "format_strikethrough", "Strikethrough", schema.marks.strikethrough),
    new ListCommand("bullet_list", "list", "Bullet List", schema, schema.nodes.bullet_list),
    new ListCommand("ordered_list", "format_list_numbered", "Numbered List", schema, schema.nodes.ordered_list),
    new WrapCommand("blockquote", "format_quote", "Blockquote", schema.nodes.blockquote, schema.nodes.paragraph),
    new BlockCommand("paragraph", "subject", "Normal", schema.nodes.paragraph, schema.nodes.paragraph, {}),
    new BlockCommand("code_block", "code", "Code", schema.nodes.code_block, schema.nodes.paragraph, {}),
    new HeadingCommand(schema, 1),
    new HeadingCommand(schema, 2),
    new HeadingCommand(schema, 3),
    new HeadingCommand(schema, 4),
    new ProsemirrorCommand("link", "link", "Hyperlink", 
                           linkCommand(schema.marks.link, hooks.onEditLink)),
    new ProsemirrorCommand("horizontal_rule", "remove", "Horizontal Rule", 
                           insertCommand(schema.nodes.horizontal_rule)),
    new ProsemirrorCommand("image", "image", "Image", 
                           imageCommand(schema.nodes.image, hooks.onEditImage))
  ]
}

