export function commentCommand(markType) {

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