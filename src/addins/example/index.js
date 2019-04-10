


import BarPage from './components/BarPage'
import FooPage from './components/FooPage'

import { addinRegister } from '..'

import actions from './actions.js'
import navigation from './navigation.js'
import behaviors from './behaviors.js'

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

  // navigation 
  navigation: navigation,

  // actions
  actions: actions,

  // behaviors
  behaviors: behaviors
})
