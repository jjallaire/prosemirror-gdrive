


import { NodeSelection } from "prosemirror-state"

import { canInsert } from '../utils.js'

export function imageCommand(nodeType, onEditImage) {

  return (state, dispatch) => {

    if (!canInsert(state, nodeType))
      return false;

    if (dispatch) {
      // get existing attributes if this is an edit operation
      let image = { src: null, title: null };
      if (state.selection instanceof NodeSelection && state.selection.node.type === nodeType) {
        let attrs = state.selection.node.attrs;
        image = { 
          src: attrs.src,
          title: attrs.title
        }
      }
        
      // edit the image
      onEditImage(image)
        .then(result => {
          if (result) {
            // https://discuss.prosemirror.net/t/how-to-select-a-node-immediately-after-inserting-it/1566
            const image = nodeType.createAndFill(result);
            const tr = state.tr;
            tr.replaceSelectionWith(image);
            const resolvedPos = tr.doc.resolve(
              tr.selection.anchor - tr.selection.$anchor.nodeBefore.nodeSize
            );
            tr.setSelection(new NodeSelection(resolvedPos));
            dispatch(tr);
          }
        });
    }
    
    return true;
  }

}

