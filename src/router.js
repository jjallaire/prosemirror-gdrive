
import Vue from 'vue'
import VueRouter from 'vue-router'

import HomePage from './components/HomePage.vue'

import HelpPage from './components/help/HelpPage.vue'
import SettingsPage from './components/settings/SettingsPage.vue'

Vue.use(VueRouter)

export default new VueRouter({

  mode: 'history',

  routes: [
    { path: '/', component: HomePage },
    { path: '/settings/', component: SettingsPage },
    { path: '/help/', component: HelpPage }
  ]

});