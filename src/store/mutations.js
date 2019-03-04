

export const SET_INITIALIZED = 'SET_INITIALIZED'
export const SET_USER = 'SET_USER'

export default {

  [SET_INITIALIZED](state, initialized) {
    state.initialized = initialized;
  },

  [SET_USER](state, user) {
    state.user = user;
  },

};