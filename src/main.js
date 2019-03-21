// vue
import Vue from 'vue'

// vuetify
import './core/vuetify'

// google analysics
import './core/analytics'

// application
import App from './App.vue'
import drive from './drive/'
import router from './core/router'
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

