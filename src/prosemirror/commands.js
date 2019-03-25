

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


function insertCommand(nodeType) {

  return (state, dispatch) => {

    // verify that we can insert
    let from = state.selection.$from
    for (let d = from.depth; d >= 0; d--) {
      let index = from.index(d)
      if (from.node(d).canReplaceWith(index, index, nodeType)) {
        if (dispatch)
          dispatch(state.tr.replaceSelectionWith(nodeType.create()))
        return true;
      }
    }

    // couldn't insert
    return false;
  }
}

function linkCommand(markType, onEditLink) {

  return (state, dispatch, view) => {

    // requires a selection
    if (state.selection.empty)
      return false;

    if (dispatch) {

      // turn it off if it's active
      if (markIsActive(state, markType)) {
        toggleMark(markType)(state, dispatch);
      } else {
        onEditLink()
          .then(attr => {
            if (attr) {
              toggleMark(markType, attr)(state, dispatch);  
              view.focus();
            }
          });
      }
    }

    return true;
  }

}





export function buildCommands(schema, hooks) {
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
    new BlockCommand("paragraph", "subject", "Normal", schema.nodes.paragraph, schema.nodes.paragraph, {}),
    new BlockCommand("code_block", "code", "Code", schema.nodes.code_block, schema.nodes.paragraph, {}),
    new HeadingCommand(schema, 1),
    new HeadingCommand(schema, 2),
    new HeadingCommand(schema, 3),
    new HeadingCommand(schema, 4),
    new EditorCommand("link", "link", "Hyperlink", linkCommand(schema.marks.link, hooks.onEditLink)),
    new EditorCommand("horizontal_rule", "remove", "Horizontal Rule", insertCommand(schema.nodes.horizontal_rule))
  ]
}

