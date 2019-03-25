
import { schema } from "prosemirror-schema-basic"
import { addListNodes } from "prosemirror-schema-list"
import { EditorState, Plugin, PluginKey } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { Schema, DOMParser, DOMSerializer } from 'prosemirror-model'
import { history } from "prosemirror-history"
import { keymap } from "prosemirror-keymap"
import { baseKeymap } from "prosemirror-commands"
import { dropCursor } from 'prosemirror-dropcursor'
import { gapCursor } from 'prosemirror-gapcursor'

import { buildMarks } from './marks'
import { buildKeymap } from "./keymap"
import { buildInputRules } from "./inputrules"
import { buildCommands } from './commands' 

import { Command } from '../core/command'


export default class ProsemirrorEditor {

  constructor(place, options) {

    // save options
    this._options = {
      editable: true,
      autoFocus: false,
      content: '',
      hooks: {
        onUpdate: () => {},
        onEditLink: Promise.resolve(null)
      },
      mapKeys: {},
     
      ...options
    };

    // create schema
    this._schema = new Schema({
      nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
      marks: buildMarks()
    });

    // create the editor state
    this._state = EditorState.create({ 
      schema: this._schema,
      doc: this._createDocument(this._options.content),
      plugins: [
        history(),
        buildInputRules(this._schema),
        keymap(buildKeymap(this._schema, this._options.mapKeys)),
        keymap(baseKeymap),
        dropCursor(),
        gapCursor(),
        new Plugin({
          key: new PluginKey('editable'),
          props: {
            editable: () => this._options.editable,
          },
        }),
      ]
    });
  
    // create the editor
    this._view = new EditorView(place, { 
      state: this._state,
      dispatchTransaction: this._dispatchTransaction.bind(this)
    });

    // create editor commands
    this._commands = buildCommands(this._schema, this._options.hooks);

    // auto-focus if requested
    if (this._options.autoFocus) {
      setTimeout(() => {
        this.focus()
      }, 10)
    }

  }

  destroy() {
    if (this._view) {
      this._view.destroy();
      this._view = null;
    }
  }

  setContent(content = {}, emitUpdate = false) {
    this._state = EditorState.create({
      schema: this._state.schema,
      doc: this._createDocument(content),
      plugins: this._state.plugins
    })

    this._view.updateState(this._state)

    if (emitUpdate)
      this._emitUpdate()
  }

  getHTML() {
    const div = document.createElement('div')
    const fragment = DOMSerializer
      .fromSchema(this._state.schema)
      .serializeFragment(this._state.doc.content)

    div.appendChild(fragment)

    return div.innerHTML
  }

  getJSON() {
    return this._state.doc.toJSON()
  }

  focus() {
    this._view.focus()
  }

  blur() {
    this._view.dom.blur()
  }

  // adapt editor commands to the generic (no arg) command interface, then
  // return an object keyed by command name
  get commands() {
    
    return this._commands.reduce((commands, command) => ({
      ...commands,
      [command.name]: new EditorCommandAdaptor(command, this)
    }), {});

  }

  _createDocument(content) {

    const kEmptyDocument = {
      type: 'doc',
      content: [{
        type: 'paragraph',
      }],
    };

    if (content === null) {
      return this._schema.nodeFromJSON(kEmptyDocument);

    } else if (typeof content === 'object') {
      return this._schema.nodeFromJSON(content);

    } else if (typeof content === 'string') {
      const element = document.createElement('div')
      element.innerHTML = content.trim();
      return DOMParser.fromSchema(this._schema).parse(element);
    
    } else {
      return null;
    }
  }

  _dispatchTransaction(transaction) {
    
    this._state = this._state.apply(transaction)
    this._view.updateState(this._state)
    
    if (transaction.docChanged) {
      this._emitUpdate(transaction);
    }
  }

  _emitUpdate(transaction) {
    this._options.hooks.onUpdate({
      getHTML: this.getHTML.bind(this),
      getJSON: this.getJSON.bind(this),
      state: this._state,
      transaction
    })
  }

}



class EditorCommandAdaptor extends Command {
      
  constructor(command, editor) {
    super(command.name, command.icon, command.title)
    this._command = command;
    this._editor = editor;
  }

  isEnabled() {
    return this._command.isEnabled(this._editor._state);
  }

  isLatched() {
    return this._command.isLatched(this._editor._state);
  }

  execute() {
    let editor = this._editor;
    editor._view.focus();
    return this._command.execute(editor._state, editor._view.dispatch, editor._view);
  }
}


