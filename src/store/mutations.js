import Vue from 'vue'

export const SET_INITIALIZED = 'SET_INITIALIZED'
export const SET_INIT_ERROR = 'SET_INIT_ERROR'
export const SET_USER = 'SET_USER'
export const SET_DOC = 'SET_DOC'
export const SET_RECENT_DOCS = 'SET_RECENT_DOCS'
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

  [SET_DOC](state, doc) {
    state.doc = doc;
  },

  [SET_RECENT_DOCS](state, recent_docs) {
    state.recent_docs = recent_docs;
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