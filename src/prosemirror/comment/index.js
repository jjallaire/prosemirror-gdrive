
import { Plugin, PluginKey } from "prosemirror-state"
import { Decoration, DecorationSet } from "prosemirror-view"
import { AddMarkStep } from "prosemirror-transform"

// NodeViews might be a better match here: https://prosemirror.net/examples/footnote/

export const commentMark = {
  parseDOM: [
    {
      tag: 'span.comment',
    },
  ],
  toDOM: () => ['span', { class: 'comment' }, 0]
}


export function commentCommand(markType) {

  return (state, dispatch) => {

    // must have a selection
    if (state.selection.empty)
      return false;

    // dispatch if requested
    if (dispatch) {

      // add a comment mark
      let tr = state.tr;
      tr.addMark(state.selection.from, state.selection.to, markType.create());
    
      // dispatch the transaction
      dispatch(tr);
    }

    return true;

  }
}

export function commentsPlugin(markType) {

  return new Plugin({
    key: new PluginKey('comments'),
    state: {
      init(config, instance) {

      
        let doc = instance.doc;

        let comments = [];
        doc.descendants((node, pos) => {
          if (markType.isInSet(node.marks))
            comments.push(createComment(doc, pos))
        });    

        return DecorationSet.create(doc, comments);
      },
      apply(tr, set) {
        
        // adjust decoration positions to changes made by the transaction
        set = set.map(tr.mapping, tr.doc, {
          onRemove() {
            
          }
        });

        // if any comments were inserted then add a comments aside
        tr.steps.forEach(step => {
          if (step instanceof AddMarkStep) {
            let type = step.mark.type;
            if (type.name === "comment") {
              let commentWidget = createComment(tr.doc, step.from);
              set = set.add(tr.doc, [commentWidget]);
            }
          }
        });
        return set;
      }
    },
    props: {
      decorations(state) {
        return this.getState(state);
      }
    },
  })
  
}


function createComment(doc, at) {
  const resolvedPos = doc.resolve(at);
  const afterPos = resolvedPos.after(1);
  let comment = document.createElement('aside');
  comment.setAttribute('class', 'sidebar-comments');
  comment.innerHTML = "Here is a comment<br/>";
  return Decoration.widget(afterPos, comment, { marks: [] });
}
