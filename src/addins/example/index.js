


import BarPage from './components/BarPage'
import FooPage from './components/FooPage'

import { addinRegister } from '..'

import actions from './actions.js'
import navigation from './navigation.js'

addinRegister({

  // override config values
  config: {
    app: {
      title: "ProseMirror with Addins"
    }
  },

  // routes
  routes: [
    { path: "/foo/", component: FooPage },
    { path: "/bar/", component: BarPage },
  ],

  // additional navigation groups/routes
  navigation: navigation,

  // custom actions
  actions: actions
})
