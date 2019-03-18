
import { schema } from "prosemirror-schema-basic"
import { addListNodes } from "prosemirror-schema-list"
import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { Schema, DOMParser, DOMSerializer } from 'prosemirror-model'
import { history } from "prosemirror-history"
import { keymap } from "prosemirror-keymap"
import { baseKeymap } from "prosemirror-commands"
import { dropCursor } from 'prosemirror-dropcursor'
import { gapCursor } from 'prosemirror-gapcursor'

import { buildKeymap } from "./keymap"
import { buildInputRules } from "./inputrules"


export default class ProsemirrorEditor {

  constructor(place, options) {

    // save options
    this._options = {
      autoFocus: false,
      content: '',
      mapKeys: {},
      onUpdate: () => {},
      ...options
    };

    // create schema
    this._schema = new Schema({
      nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
      marks: schema.spec.marks
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
        gapCursor()
      ]
    });
  
    // create the editor
    this._view = new EditorView(place, { 
      state: this._state,
      dispatchTransaction: this._dispatchTransaction.bind(this)
    });

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
    this._options.onUpdate({
      getHTML: this.getHTML.bind(this),
      getJSON: this.getJSON.bind(this),
      state: this._state,
      transaction
    })
  }

}


