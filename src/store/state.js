


export function initialState() {
  return {
    // initialization
    initialized: false,
    init_error: null,

    // current user 
    user: null,

    // settings
    settings: {
      recent_documents: 5
    },

    // document history
    recent_docs: [],

    // data-drive navigation groups
    navigation_groups: [],

    // snackbar error
    snackbar_error: null
  };
}
