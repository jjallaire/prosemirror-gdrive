

export function commentCommand(markType, onEditComment) {

  return (state, dispatch, view) => {

    // require a selection
    if (state.selection.empty)
      return false;

    // dispatch if requested
    if (dispatch) {
       // show edit ui
       onEditComment()
        .then(comment => {
          if (comment) {
            let tr = state.tr;
            tr.addMark(state.selection.from, state.selection.to, markType.create(comment));
            dispatch(tr);
          }
          view.focus();
        });
    }

    return true;

  }
}

