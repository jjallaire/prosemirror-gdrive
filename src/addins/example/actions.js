

import drive from '../../drive'
import dialog from '../../components/core/dialog'

export default [
  
  // share document 
  {
    type: 'button',
    icon: 'people',
    color: 'info',
    caption: "Share",
    handler: doc_id => {
      drive.shareFile(doc_id);
    }
  },

  // convert to google doc
  {
    type: 'menu',
    icon: 'insert_drive_file',
    caption: 'Publish as Google Doc',
    handler: doc_id => {
      drive
        .convertToGoogleDoc(doc_id)
        .then(response => {
          window.open(`https://docs.google.com/document/d/${response.id}/edit`, "_blank");
        })
        .catch(error => {
          dialog.errorSnackbar("Unable to Publish as Google Doc: " + error.message);
        });
    }
  }
];

