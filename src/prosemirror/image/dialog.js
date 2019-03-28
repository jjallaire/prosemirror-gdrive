


import { NodeSelection } from "prosemirror-state"

export function imageDialog(node, nodeType, state, dispatch, onEditImage) {

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

