import Vue from 'vue'

import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'
import 'typeface-roboto'
import 'material-icons/iconfont/material-icons.css'
Vue.use(Vuetify, {
  iconfont: 'md',
})

import App from './App.vue'

import router from './router'
import store from './store/'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
