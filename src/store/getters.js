

export default {

  initialized: (state) => state.initialized,

  init_error: (state) => state.init_error,

  authorized: (state) => state.user !== null,

  user: (state) => state.user,

  page_title: (state) => state.page_title,

  page_title_link: (state) => state.page_title_link,

  page_subtitle: (state) => state.page_subtitle,

  doc: (state) => state.doc,

  settings: (state) => state.settings,

  snackbar_error: (state) => state.snackbar_error

}
