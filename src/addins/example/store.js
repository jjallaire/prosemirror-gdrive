
// addins can have their own private store, e.g. 

import Vuex from 'vuex'

export const SET_NAME = 'SET_NAME';

export default new Vuex.Store({

  state: {
    name: ''
  },

  getters: {
    name: state => state.name
  },

  mutations: {
    [SET_NAME](state, name) {
      state.name = name;
    }
  }

})