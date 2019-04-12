

import drive from '../../drive'
import dialog from '../../components/core/dialog'
dialog.prompt

export default [
  
  // share document 
  {
    type: 'button',
    icon: 'people',
    color: 'info',
    caption: "Share",
    handler: doc => {
      doc
        .setProperties({ status: "shared" })
        .then(() => {
          return dialog.prompt("Share Document", "User email:")
        })
        .then(emailAddress => {
          if (emailAddress) {
            return drive.shareFile(
              doc.id,  "writer", "user", emailAddress, 
              `You can edit this document at ${window.location.href}`
            )
          }
        })
        .catch(error => {
          dialog.errorSnackbar("Unable to share document: " + error.message);
        });
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

