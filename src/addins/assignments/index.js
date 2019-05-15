

import { addinRegister } from '..'

//import actions from './actions.js'
import navigation from './navigation.js'
//import behaviors from './behaviors.js'

import AssignmentsPage from './components/AssignmentsPage.vue'

addinRegister({

   // navigation 
   navigation: navigation,

    // routes
  routes: [
   { path: "/assignments/", component: AssignmentsPage },
 ],

});
