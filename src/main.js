// vue
import Vue from 'vue'

// vuetify
import './core/vuetify'

// logging and google analytics
import * as log from './core/log'
import './core/analytics'

// browser update
import '@/components/core/browser-update.js'

// application
import App from './App.vue'
import drive from './drive/'
import router from './core/router'
import store from './store/'

// config
Vue.config.productionTip = false

// initialize log
log.initialize();

// import addins
// import './addins/example'

// connect to drive
drive.connect()

// create app
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

