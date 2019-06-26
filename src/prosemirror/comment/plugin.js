

// NodeViews might be a better match here: https://prosemirror.net/examples/footnote/
// footnote example: 
//   https://prosemirror.net/examples/footnote/
//   https://glitch.com/edit/#!/voracious-perigee?path=index.js:18:26

// simple paragraph example: https://observablehq.com/@hubgit/prosemirror-nodeviews-example

// discussion of input in node views:
//  https://discuss.prosemirror.net/t/creating-a-custom-node-with-inline-input/1282/8



/*
    - Add a new block level node type named 'aside'
    - We create a node view for asides 
    - When inserting footnotes we check for an aside node view 
      for the current paragraph and then use that
    - filterTransaction to prevent deletion? (https://discuss.prosemirror.net/t/how-to-prevent-node-deletion/130/8)



*/

// TODO: Way to prevent removal of decorations (NodeView?)
// TODO: Some sort of comment selection

// from the website: https://github.com/ProseMirror/website/blob/d9427c7ff48312149f7be4607b1bf393240ab683/src/collab/client/comment.js


import { Plugin, PluginKey } from "prosemirror-state"
import { Decoration, DecorationSet } from "prosemirror-view"
import { AddMarkStep } from "prosemirror-transform"


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

  comment.addEventListener("click", () => {
    comment.classList.toggle('comment-expanded');
  });

  comment.innerHTML = mark.attrs['data-comment'] + "<br/>";
  return Decoration.widget(afterPos, comment, { marks: [] });
}
