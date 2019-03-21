
import Vue from 'vue'
import VueAnalytics from 'vue-analytics'

import config from '../config'
import router from './router'

let production = process.env.NODE_ENV === 'production';

Vue.use(VueAnalytics, {
  id: config.ga.id,
  router: router,
  debug: {
    sendHitTask: production
  }
})

