import _retry from 'async/retry'
import drive from '../../drive'

export default class EditorSyncManager  {

  constructor(docId, docInfo, onSyncTitle, onSyncDoc, onSyncError) {
    this._docId = docId;
    this._docInfo = docInfo;
    this._onSyncTitle = onSyncTitle;
    this._onSyncDoc = onSyncDoc;
    this._onSyncError = onSyncError;
  }

  onDriveChanged(changes) {
    let thisDocChange = changes.find(change => change.fileId === this._docId);
    if (thisDocChange) {
      _retry(
        {
          // retry up to 5 times
          times: 5,

          // try every 5 seconds
          interval: 5000
        },

        callback => {
          drive
            .getFileMetadata(this._docId)
            .then(metadata => {
              let doc = this._docInfo();
              // if the change has a different revisionId then get the file
              if (metadata.headRevisionId !== doc.headRevisionId) {
                return drive.getFile(this._docId)
              // otherwise check for a title change
              } else if (doc.title !== metadata.name) {
                this._onSyncTitle(metadata.name);
              } 
            })
            .then(doc => {
              if (doc)
                this._onSyncDoc(doc);
              callback(null, null);
            })
            .catch(error => {
              callback(error, null);
            });
        },

        // result function
        error => {
          if (error)
            this._onSyncError(error);
        }
      );
    }
  }
}