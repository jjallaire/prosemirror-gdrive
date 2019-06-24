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



// footnote example: 
//   https://prosemirror.net/examples/footnote/
//   https://glitch.com/edit/#!/voracious-perigee?path=index.js:18:26

// simple paragraph example: https://observablehq.com/@hubgit/prosemirror-nodeviews-example


/*
    - Add a new block level node type named 'aside'
    - We create a node view for asides 
    - When inserting footnotes we check for an aside node view 
      for the current paragraph and then use that
    - filterTransaction to prevent deletion? (https://discuss.prosemirror.net/t/how-to-prevent-node-deletion/130/8)



*/

// TODO: Way to prevent removal of decorations (NodeView?)
// TODO: Some sort of comment selection
