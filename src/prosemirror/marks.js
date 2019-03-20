

import { schema } from "prosemirror-schema-basic"

export function buildMarks() {

  // schema.spec.marks is an OrderedMap (https://github.com/marijnh/orderedmap)
  return schema.spec.marks.append({
    underline: {
      parseDOM: [
        {
          tag: 'u',
        },
        {
          style: 'text-decoration',
          getAttrs: value => value === 'underline',
        },
      ],
      toDOM: () => ['u', 0],
    },
    strikethrough: {
      parseDOM: [
        {
          tag: 's',
        },
        {
          tag: 'del',
        },
        {
          tag: 'strike',
        },
        {
          style: 'text-decoration',
          getAttrs: value => value === 'line-through',
        },
      ],
      toDOM: () => ['s', 0],
    }
  });
}