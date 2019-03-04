
import Vue from 'vue'
import VueRouter from 'vue-router'

import HomePage from './components/HomePage.vue'
import SettingsPage from './components/SettingsPage.vue'
import AuthPage from './components/AuthPage.vue'

Vue.use(VueRouter)

export default new VueRouter({

  mode: 'history',

  routes: [
    { path: '/', component: HomePage },
    { path: '/auth/', component: AuthPage },
    { path: '/settings/', component: SettingsPage }
  ]

});