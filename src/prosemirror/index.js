
import { EditorState, Plugin, PluginKey, NodeSelection } from "prosemirror-state"
import { Decoration, DecorationSet, EditorView } from "prosemirror-view"
import { Schema, DOMParser, DOMSerializer } from 'prosemirror-model'
import { ChangeSet, simplifyChanges } from 'prosemirror-changeset'
import { history } from "prosemirror-history"
import { keymap } from "prosemirror-keymap"
import { baseKeymap } from "prosemirror-commands"
import { dropCursor } from 'prosemirror-dropcursor'
import { gapCursor } from 'prosemirror-gapcursor'

import { buildMarks } from './marks'
import { buildNodes } from './nodes'
import { buildKeymap } from "./keymap"
import { buildInputRules } from "./inputrules"
import { EditorCommand, buildCommands } from './commands' 
import { imagePlugin } from "./image/plugin.js";

import { recreateTransform } from './recreate.js'


export default class ProsemirrorEditor {

  constructor(place, options) {

    // save options
    this._options = {
      autoFocus: false,
      content: '',
      content_revision: null,
      hooks: {
        isEditable: () => true,
        onUpdate: () => {},
        onSelectionChanged: () => {},
        onEditLink: Promise.resolve(null),
        onEditImage: Promise.resolve(null)
      },
      mapKeys: {},
      ...options
    };

    // create schema
    this._schema = new Schema({
      marks: buildMarks(),
      nodes: buildNodes()
    });

    // setup document and plugins
    let doc = this._createDocument(this._options.content);
    let plugins = [
      history(),
      buildInputRules(this._schema),
      keymap(buildKeymap(this._schema, this._options.mapKeys)),
      keymap(baseKeymap),
      dropCursor(),
      gapCursor(),
      new Plugin({
        key: new PluginKey('editable'),
        props: {
          editable: this._options.hooks.isEditable
        },
      }),
      imagePlugin(this._schema.nodes.image, this._options.hooks.onEditImage)
    ];


    // if we have a content revision then we need to display diffs
    // (diffs are returned in the form of a new document and a custom
    // plugin that renders diff decorations)
    if (this._options.content_revision) {
      let diff = this._computeDiffDocument();
      doc = diff.doc;
      plugins = plugins.concat(diff.plugins);
    }

    // create the editor state
    this._state = EditorState.create({ 
      schema: this._schema,
      doc: doc,
      plugins: plugins
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

  _computeDiffDocument() {
    // based on https://gitlab.com/mpapp-public/prosemirror-recreate-steps/blob/master/demo/history/index.js
    
    // recreate transform from base to revision
    let baseDoc = this._schema.nodeFromJSON(this._options.content);
    let revisionDoc = this._schema.nodeFromJSON(this._options.content_revision);
    let tr = recreateTransform(baseDoc, revisionDoc);
    
    // create decorations corresponding to the changes
    const decorations = []
    let changeSet = ChangeSet.create(baseDoc).addSteps(tr.doc, tr.mapping.maps);
    let changes = simplifyChanges(changeSet.changes, tr.doc);
   
    // insertion
    changes.forEach(change => {
      decorations.push(
        Decoration.inline(change.fromB, change.toB, { class: 'insertion' }, {})
      )
    });

    // deletion
    let deletionPos = null;
    let lastDeletionTo = null;
    changes.forEach(change => {
      
      // do we need to reset the deletion position?
      if (deletionPos === null || lastDeletionTo === null || (lastDeletionTo + 1) !== change.fromA)
        deletionPos = change.fromB;

      // do the deletion
      let slice = baseDoc.slice(change.fromA, change.toA);
      let span = document.createElement('span');
      span.setAttribute('class', 'deletion');
      span.appendChild(
        DOMSerializer.fromSchema(this._schema).serializeFragment(slice.content)
      )
      decorations.push(
        Decoration.widget(deletionPos, span, { marks: []})
      );

      // record last deletion end
      lastDeletionTo = change.toA;
    });

    // plugin to apply diff decorations
    const decorationSet = DecorationSet.create(tr.doc, decorations);
    let decosPlugin = new Plugin({
      key: new PluginKey('diffs'),
      props: {
        decorations() {
          return decorationSet;
        }
      }
    })

    // return
    return {
      doc: tr.doc,
      plugins: [decosPlugin]
    }
   
  }

  _dispatchTransaction(transaction) {
    
    // apply the transaction
    this._state = this._state.apply(transaction)
    this._view.updateState(this._state)
    
    // notify listeners of selection change
    this._emitSelectionChanged();
   
    // notify listeners of updates
    if (transaction.docChanged) {
      this._emitUpdate(transaction);
    }
  }

  _emitSelectionChanged() {
    if (this._options.hooks.onSelectionChanged) {
      this._options.hooks.onSelectionChanged({
        type: (this._state.selection instanceof NodeSelection) ? 'node' : 'text'
      });
    }
  }

  _emitUpdate(transaction) {
    if (this._options.hooks.onUpdate) {
      this._options.hooks.onUpdate({
        time: transaction.time,
        getHTML: this.getHTML.bind(this),
        getJSON: this.getJSON.bind(this),
      })
    }
  }

}

class EditorCommandAdaptor extends EditorCommand {
      
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


