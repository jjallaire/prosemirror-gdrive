
import { NodeSelection, Plugin, PluginKey } from "prosemirror-state"

import { canInsert } from '../utils.js'


export function imagePlugin(nodeType, onEditImage) {
  return new Plugin({
    key: new PluginKey('image'),
    props: {
      handleDoubleClickOn: (view, pos, node) => {
        if (node.type === nodeType) {
          editImageDialog(
            node, 
            nodeType, 
            view.state, 
            view.dispatch, 
            onEditImage
          );
          return true;
        } else {
          return false;
        }
      }
    },
  })
}

export function imageCommand(nodeType, onEditImage) {

  return (state, dispatch) => {

    if (!canInsert(state, nodeType))
      return false;

    if (dispatch) {

      // see if we are editing an existing node
      let node = null;
      if (state.selection instanceof NodeSelection && state.selection.node.type === nodeType)
        node = state.selection.node;

      // show dialog
      editImageDialog(node, nodeType, state, dispatch, onEditImage);
    }
    
    return true;
  }

}

function editImageDialog(node, nodeType, state, dispatch, onEditImage) {

  // if we are being called with an existing node then read it's attributes 
  let image = { src: null, title: null };
  if (node && node.type === nodeType) {
    image = { 
      src: node.attrs.src,
      title: node.attrs.title
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

