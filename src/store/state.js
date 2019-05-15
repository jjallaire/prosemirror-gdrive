


export function initialState() {
  return {
    // initialization
    initialized: false,
    init_error: null,

    // current user 
    user: null,

    // current doc
    doc: docInfo(),

    // settings
    settings: {
      recent_documents: 5
    },

    // document history
    recent_docs: [],

    // snackbar error
    snackbar_error: null
  };
}

export function docInfo(id = null, title = null, headRevisionId = null, properties = null) {
  return {
    id,
    title,
    headRevisionId,
    properties: properties || {}
  }
}
