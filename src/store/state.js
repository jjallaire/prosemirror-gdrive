


export function initialState() {
  return {
    // initialization
    initialized: false,
    init_error: null,

    // current user 
    user: null,

    // settings
    settings: {
      document_history: 50
    },

    // document history
    recent_docs: []
  };
}
