

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const SET_INITIALIZED = 'SET_INITIALIZED'
export const SET_USER = 'SET_USER'
export const CLEAR_USER = 'CLEAR_USER'

function noUser() {
  return {
    id: null,
    name: null,
    email: null
  };
}

const store = new Vuex.Store({
  state: {
    initialized: false,
    user: noUser()
  },
  mutations: {

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
  }
})

export default store;


