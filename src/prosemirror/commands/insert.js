
export function insertCommand(nodeType) {

  return (state, dispatch) => {

    // verify that we can insert
    let from = state.selection.$from
    for (let d = from.depth; d >= 0; d--) {
      let index = from.index(d)
      if (from.node(d).canReplaceWith(index, index, nodeType)) {
        if (dispatch)
          dispatch(state.tr.replaceSelectionWith(nodeType.create()))
        return true;
      }
    }

    // couldn't insert
    return false;
  }
}

