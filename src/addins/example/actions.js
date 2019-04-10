

import drive from '../../drive'
import dialog from '../../components/core/dialog'

export default [
  
  // share document 
  {
    type: 'button',
    icon: 'people',
    color: 'info',
    caption: "Share",
    handler: doc => {
      drive.shareFile(doc.id);
    },
    /* action availability can be conditional on properties
    filter: properties => {
      return properties.foo === 'foo';
    }
    */
  },

  // convert to google doc
  {
    type: 'menu',
    icon: 'insert_drive_file',
    caption: 'Publish as Google Doc',
    handler: doc => {
     
      /* actions can set document properties
      doc.setProperties({ foo: "foo" })
      */

      drive
        .convertToGoogleDoc(doc.id)
        .then(response => {
          window.open(`https://docs.google.com/document/d/${response.id}/edit`, "_blank");
        })
        .catch(error => {
          dialog.errorSnackbar("Unable to Publish as Google Doc: " + error.message);
        });
    }
  }
];

