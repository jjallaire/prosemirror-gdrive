


export function initialState() {
  return {
    // initialization
    initialized: false,
    init_error: null,

    // current user 
    user: null,

    // settings
    settings: {
      recent_documents: 100
    },

    // document history
    recent_docs: []
  };
}
