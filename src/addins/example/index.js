


import BarPage from './BarPage'
import FooPage from './FooPage'

import { registerAddin } from '..'

registerAddin({

  // override config values
  config: {
    app: {
      title: "ProseMirror with Addins"
    }
  },

  // provide routes
  routes: [
    { path: "/foo/", component: FooPage },
    { path: "/bar/", component: BarPage },
  ],

  // provide additional navigation groups/routes
  navigation: {
    groups: [
      {
        caption: "Example Group",
        icon: "alarm",
        expanded: false,
        items: [
          {
            caption: "Foo",
            path: "/foo/"
          },
          {
            caption: "Bar",
            path: "/bar/"
          }
        ]
      }
    ]
  }
})
