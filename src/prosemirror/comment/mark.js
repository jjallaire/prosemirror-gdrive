

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

