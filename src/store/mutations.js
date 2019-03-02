

export const SET_INITIALIZED = 'SET_INITIALIZED'
export const SET_USER = 'SET_USER'
export const CLEAR_USER = 'CLEAR_USER'

import { noUser } from './state'

export default {

  [SET_INITIALIZED](state, initialized) {
    state.initialized = initialized;
  },

  [SET_USER](state, { id, name, email }) {
    state.user = {
      id,
      name,
      email
    };
  },

  [CLEAR_USER](state) {
    state.user = noUser();
  }

};