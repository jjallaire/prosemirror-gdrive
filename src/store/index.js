

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const SET_INITIALIZED = 'SET_INITIALIZED'
export const SET_USER = 'SET_USER'

const store = new Vuex.Store({
  state: {
    initialized: false,
    user: false
  },
  mutations: {
    [SET_INITIALIZED](state, initialized) {
      state.initialized = initialized;
    },

    [SET_USER](state, user) {
      state.user = user;
    }
  }
})

export default store;


