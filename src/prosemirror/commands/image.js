


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
          if (result)
            dispatch(
              state.tr.replaceSelectionWith(nodeType.createAndFill(result))
            )
        });
    }
    
    return true;
  }

}

