

import { actionButton, statusMessage } from './selectors'

export default {

  initialized: (state) => state.initialized,

  init_error: (state) => state.init_error,

  authorized: (state) => state.user !== null,

  user: (state) => state.user,

  page_title: (state) => state.page_title,

  page_title_link: (state) => state.page_title_link,

  page_subtitle: (state) => state.page_subtitle,

  doc: (state) => state.doc,

  save_status: (state) => state.save_status,

  settings: (state) => state.settings,

  snackbar_error: (state) => state.snackbar_error,

  // active action_button 
  action_button: (state) => {
    return actionButton(state.user, state.doc.properties.status);
  },

  // active status message (shown in place of action_button when 
  // no actions are possible)
  status_message: (state) => {
    return statusMessage(state.user, state.doc.properties.status, state.doc.properties.grade);
  },

}
