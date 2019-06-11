


export function initialState() {
  return {
    // initialization
    initialized: false,
    init_error: null,

    // current user 
    user: null,

    // page title
    page_title: null,
    page_title_link: null,
    page_subtitle: null,

    // current doc
    doc: docInfo(),

    // settings
    settings: {
      my_setting: 5
    },

    // snackbar error
    snackbar_error: null
  };
}

export function docInfo(id = null, title = null, headRevisionId = null, properties = null, description = null) {
  return {
    id,
    title,
    headRevisionId,
    properties: properties || {},
    description: description
  }
}
