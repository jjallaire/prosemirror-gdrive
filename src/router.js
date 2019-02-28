
import Vue from 'vue'
import VueRouter from 'vue-router'

import HelloWorld from './components/HelloWorld.vue'

import AuthPage from './components/AuthPage'

Vue.use(VueRouter)

export default new VueRouter({

  mode: 'history',

  routes: [
    { path: '/', component: HelloWorld },
    { path: '/auth/', component: AuthPage}
  ]

});