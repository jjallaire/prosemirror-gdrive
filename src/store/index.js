

import Vue from 'vue'
import Vuex from 'vuex'

import { initialState } from './state'
import getters from './getters'
import mutations from './mutations'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: initialState(),
  getters: getters,
  mutations: mutations
})

export default store;


