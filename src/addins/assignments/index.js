

import { addinRegister } from '..'


import AssignmentPage from './components/AssignmentPage.vue'
import AssignmentsPage from './components/AssignmentsPage.vue'

addinRegister({

  // navigation 
  navigation: {
    items: [
      {
        caption: "Assignments",
        icon: "alarm",
        path: "/assignments/"
      }
    ]
  },

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
