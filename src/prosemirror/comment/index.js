
import { Plugin, PluginKey } from "prosemirror-state"
import { Decoration, DecorationSet } from "prosemirror-view"
import { AddMarkStep } from "prosemirror-transform"

// NodeViews might be a better match here: https://prosemirror.net/examples/footnote/

export const commentMark = {
  attrs: { 'data-id': {}, 'data-comment': {} }, 
  parseDOM: [
    {
      tag: 'span.comment',
      getAttrs(dom) { 
        return {
          'data-id': dom['data-id'],
          'data-comment': dom['data-comment']
        }
      }
    },
  ],
  toDOM(node) { 
    return [
      'span', 
      { 
        class: 'comment', 
        'data-id': node.attrs['data-id'], 
        'data-comment': node.attrs['data-comment'] 
      }, 
      0
    ]
  },
  inclusive: false
}


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

export function commentsPlugin(markType) {

  return new Plugin({
    key: new PluginKey('comments'),
    state: {
      init(config, instance) {

      
        let doc = instance.doc;

        let comments = [];
        doc.descendants((node, pos) => {
          node.marks.forEach(mark => {
            if (mark.type === markType)
              comments.push(createComment(doc, pos, mark))
          })  
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
            if (step.mark.type === markType) {
              let commentWidget = createComment(tr.doc, step.from, step.mark);
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


function createComment(doc, at, mark) {
  const resolvedPos = doc.resolve(at);
  const afterPos = resolvedPos.after(1);
  let comment = document.createElement('aside');
  comment.setAttribute('class', 'sidebar-comments');
  comment.innerHTML = mark.attrs['data-comment'] + "<br/>";
  return Decoration.widget(afterPos, comment, { marks: [] });
}
