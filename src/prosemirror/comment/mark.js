

export const commentMark = {
  attrs: { 'data-id': {}, 'data-comment': {}, 'data-active': {} }, 
  parseDOM: [
    {
      tag: 'span.comment',
      getAttrs(dom) { 
        return {
          'data-id': dom['data-id'],
          'data-comment': dom['data-comment'],
          'data-active': dom['data-active']
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
        'data-comment': node.attrs['data-comment'],
        'data-active': node.attrs['data-active']
      }, 
      0
    ]
  },
  inclusive: false
}

