
import { schema } from "prosemirror-schema-basic"
import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import {undo, redo, history} from "prosemirror-history"
import { keymap } from "prosemirror-keymap"
import { baseKeymap } from "prosemirror-commands"

export function createEditor(place) {

  let state = EditorState.create({ 
    schema,
    plugins: [
      history(),
      keymap({'Mod-z': undo, 'Mod-y': redo}),
      keymap(baseKeymap)
    ]
  });

  let view = new EditorView(place, { 
    state,
    dispatchTransaction(transaction) {
      let newState = view.state.apply(transaction);
      view.updateState(newState);
    }
  });

  return view;

}