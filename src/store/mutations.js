import Vue from 'vue'

export const SET_INITIALIZED = 'SET_INITIALIZED'
export const SET_INIT_ERROR = 'SET_INIT_ERROR'
export const SET_USER = 'SET_USER'
export const SET_DOC = 'SET_DOC'
export const SET_PAGE_TITLE = 'SET_PAGE_TITLE'
export const UPDATE_SETTINGS = 'UPDATE_SETTINGS'
export const SET_SNACKBAR_ERROR = 'SET_SNACKBAR_ERROR'

export default {

  [SET_INITIALIZED](state, initialized) {
    state.initialized = initialized;
  },

  [SET_INIT_ERROR](state, error) {
    state.init_error = error;
  },

  [SET_USER](state, user) {
    state.user = user;
  },


  [SET_PAGE_TITLE](state, page_title) {
    state.page_title = page_title;
  },

  [SET_DOC](state, doc) {
    state.doc = doc;
  },

  [UPDATE_SETTINGS](state, settings) {
    Object.keys(settings).forEach(setting => {
      Vue.set(state.settings, setting, settings[setting]);
    });
  },

  [SET_SNACKBAR_ERROR](state, error) {
    state.snackbar_error = error;
  },
};