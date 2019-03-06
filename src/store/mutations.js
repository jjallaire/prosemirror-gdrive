

export const SET_INITIALIZED = 'SET_INITIALIZED'
export const SET_USER = 'SET_USER'
export const SET_RECENT_FILES = 'SET_RECENT_FILES'

export default {

  [SET_INITIALIZED](state, initialized) {
    state.initialized = initialized;
  },

  [SET_USER](state, user) {
    state.user = user;
  },

  [SET_RECENT_FILES](state, recent_files) {
    state.recent_files = recent_files;
  }

};