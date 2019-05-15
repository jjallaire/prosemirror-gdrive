

export default {

  initialized: (state) => state.initialized,

  init_error: (state) => state.init_error,

  authorized: (state) => state.user !== null,

  user: (state) => state.user,

  doc: (state) => state.doc,

  settings: (state) => state.settings,

  recent_docs: (state) => state.recent_docs,

  snackbar_error: (state) => state.snackbar_error

}
