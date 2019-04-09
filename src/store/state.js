


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

    // snackbar error
    snackbar_error: null
  };
}
