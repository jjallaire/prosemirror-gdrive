

import { addinRegister } from '..'

//import actions from './actions.js'
import navigation from './navigation.js'
//import behaviors from './behaviors.js'

import AssignmentPage from './components/AssignmentPage.vue'
import AssignmentsPage from './components/AssignmentsPage.vue'

addinRegister({

  // navigation 
  navigation: navigation,

  // routes
  routes: [
   { path: "/assignments/", component: AssignmentsPage },
   { path: '/assignment/:doc_id', component: AssignmentPage, props: true },
 ],

 // editor types
 editorTypes: [
   {
     mimeType: 'application/vnd.google.drive.ext-type.pmasn',
     path: "/assignment/"
   }
 ]

});
