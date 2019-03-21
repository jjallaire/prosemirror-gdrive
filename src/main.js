// vue
import Vue from 'vue'

// vuetify
import './core/vuetify'

// application
import App from './App.vue'
import drive from './drive/'
import router from './router'
import store from './store/'

// config
Vue.config.productionTip = false

// connect to drive
drive.connect()

// create app
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

