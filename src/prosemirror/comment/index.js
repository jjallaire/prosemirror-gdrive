
import { Plugin, PluginKey } from "prosemirror-state"
import { Decoration, DecorationSet } from "prosemirror-view"
import { AddMarkStep } from "prosemirror-transform"

export const commentMark = {
  parseDOM: [
    {
      tag: 'span.comment',
    },
  ],
  toDOM: () => ['span', { class: 'comment' }, 0]
}

const commentsPluginKey = new PluginKey('comments');

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

// https://prosemirror.net/docs/ref/#state.Plugin_System

export function commentsPlugin() {

  return new Plugin({
    key: commentsPluginKey,
    state: {
      init() {
        return DecorationSet.empty;
      },
      apply(tr, set) {
        
        // adjust decoration positions to changes made by the transaction
        set = set.map(tr.mapping, tr.doc);

        // if any comments were inserted then add a comments aside
        tr.steps.forEach(step => {
          if (step instanceof AddMarkStep) {
            let type = step.mark.type;
            if (type.name === "comment") {
              let comment = document.createElement('aside');
              comment.setAttribute('class', 'sidebar-comments');
              comment.innerHTML = "Here is a comment<br/>";

              const resolvedPos = tr.doc.resolve(step.from);
              const afterPos = resolvedPos.after(1);

              //if (set.find(afterPos, afterPos).length === 0) {
                let commentWidget = Decoration.widget(afterPos, comment, { marks: [] });
                set = set.add(tr.doc, [commentWidget]);
              //}
            }
          }
        });

        // https://prosemirror.net/examples/upload/
        // https://github.com/ProseMirror/website/blob/d9427c7ff48312149f7be4607b1bf393240ab683/src/collab/client/comment.js


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

/*
// get the comments plugin
      let commentsPlugin = commentsPluginKey.get(state);
      let pluginState = commentsPlugin.getState(state);
      let decorationSet = pluginState.decorationSet;

      // add a comment decoration if we need to
      const resolvedPos = tr.doc.resolve(state.selection.from);
      const afterPos = resolvedPos.after(1);
      if (decorationSet.find(afterPos, afterPos).length === 0) {
        let comment = document.createElement('aside');
        comment.setAttribute('class', 'sidebar-comments');
        comment.innerText = "Here is a comment";
        let commentWidget = Decoration.widget(afterPos, comment, { marks: [] });

        decorationSet = decorationSet.add(tr.doc, [commentWidget] );
      }


*/

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

/*
  // find the parent paragraph
  const resolvedPos = tr.doc.resolve(state.selection.from);
  const afterPos = resolvedPos.after(1);
  console.log(afterPos);
  
 
  //const text = markType.schema.nodes.text.create({}, "A comment", []);
  const node = markType.schema.nodes.paragraph.create({ class: 'comment' }, "A comment");
 
  tr.insert(afterPos, node);
*/