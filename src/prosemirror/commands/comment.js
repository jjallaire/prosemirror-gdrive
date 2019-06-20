export function commentCommand(markType) {


  // TODO: could also consider decorating the body node at the 
  // appropriate position (would ensure that comments aren't 
  // deleted b/c the body node can't be deleted)

  // TODO: the insertion of a comment needs to insert an additional node
  // that is right below the paragraph containing the node. This node
  // will be <p class="comment"> and should share an ID with this comment.

  // I think we want to figure out which node we are in and then do
  // a Transform.insert 

  // Prosemirror.setBlockType

  // commands.selectParentNode(pm: ProseMirror, apply: ?bool) → bool 📄
  // Move the selection to the node wrapping the current selection, if any. 
  // (Will not select the document node.)

  // commands. createParagraphNear(pm: ProseMirror, apply: ?bool) → bool 📄
  // If a block node is selected, create an empty paragraph before (if 
  // it is its parent's first child) or after it.

  return (state, dispatch) => {

    // must have a selection
    if (state.selection.empty)
      return false;

    // dispatch if requested
    if (dispatch) {
      let tr = state.tr;
      tr.addMark(state.selection.from, state.selection.to, markType.create());
      dispatch(tr);
    }

    return true;

  }


}