

export const SET_INITIALIZED = 'SET_INITIALIZED'
export const SET_INIT_ERROR = 'SET_INIT_ERROR'
export const SET_USER = 'SET_USER'
export const SET_RECENT_DOCS = 'SET_RECENT_DOCS'

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

  [SET_RECENT_DOCS](state, recent_docs) {
    state.recent_docs = recent_docs;
  }

};