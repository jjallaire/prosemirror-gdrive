
import Vue from 'vue'
import VueRouter from 'vue-router'

import HomePage from './components/HomePage.vue'
import EditPage from './components/edit/EditPage.vue'
import SettingsPage from './components/settings/SettingsPage.vue'
import NotFoundPage from './components/core/NotFoundPage.vue'

Vue.use(VueRouter)

export default new VueRouter({

  mode: 'history',

  routes: [
    { path: '/', component: HomePage },
    { path: '/edit/:doc_id?', component: EditPage, props: true },
    { path: '/settings/', component: SettingsPage },
    { path: '*', component: NotFoundPage }
  ]

});