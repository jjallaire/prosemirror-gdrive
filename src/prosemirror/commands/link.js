



import { markIsActive, getMarkAttrs, getMarkRange } from 'tiptap-utils'

import { toggleMark } from "prosemirror-commands"


export function linkCommand(markType, onEditLink) {

  return (state, dispatch, view) => {

    // creating a new link requires a selection. so the command is only 
    // available if the mark is active OR we have a full selection
    if (!markIsActive(state, markType) && state.selection.empty)
      return false;

    if (dispatch) {

      // get mark attributes if we have them
      let link = { href: null, title: null};
      if (markIsActive(state, markType))
        link = getMarkAttrs(state, markType);

      // show edit ui
      onEditLink(link)

        .then(result => {

          if (result) {

            // determine the range we will edit (either the current selection or
            // the range encompassed by the mark)
            let range = state.selection.empty ?
              getMarkRange(state.selection.$head, markType) :
              { from: state.selection.from, to: state.selection.to };

            // action: edit the link
            if (result.action === 'edit' && result.link.href) {
              let link = result.link;
              if (markIsActive(state, markType)) {
                let tr = state.tr;
                tr.removeMark(range.from, range.to, markType);
                tr.addMark(range.from, range.to, markType.create(link));
                dispatch(tr);
              } else {
                toggleMark(markType, link)(state, dispatch); 
              }

            // action: remove the link
            } else if (result.action === 'remove') {
              dispatch(state.tr.removeMark(range.from, range.to, markType));
            }
          }
              
          view.focus();
        });
    }

    return true;
  }
}