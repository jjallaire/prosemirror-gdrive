export function commentCommand(markType) {


  // TODO: the insertion of a comment needs to insert an additional node
  // that is right below the paragraph containing the node. This node
  // will be <p class="comment"> and should share an ID with this comment.

  // I think we want to figure out which node we are in and then do
  // a Transform.insert 

  // Prosemirror.setBlockType

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