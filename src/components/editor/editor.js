

import { Editor } from 'tiptap'

import _throttle from 'lodash/throttle'

import drive from '../../drive'

import {
  Blockquote,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
} from 'tiptap-extensions'

export default {

  create(doc) {

    // parse doc if it's not empty
    let content = doc.content;
    if (content.length > 0)
      content = JSON.parse(doc.content);

    return new Editor({
      content: content,
      autoFocus: true,
      extensions: [
        new Blockquote(),
        new BulletList(),
        new HardBreak(),
        new Heading({ levels: [1, 2, 3] }),
        new HorizontalRule(),
        new ListItem(),
        new OrderedList(),
        new Bold(),
        new Code(),
        new Italic(),
        new Link(),
        new Strike(),
        new Underline(),
        new History(),
      ],
      onUpdate: _throttle(function(update) {
        saveToDrive(doc, update);
      }, 5000, { leading: false, trailing: true })
    });
  }

}

function saveToDrive(doc, update) {
  drive
    .saveFile(
      doc.metadata.id, 
      JSON.stringify(update.getJSON()), 
      update.getHTML()
    )
    .then(() => {

    })
    .catch(error => {
      console.log(error);
    });
}
