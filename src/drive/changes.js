

import Vue from 'vue'

const gapi = window.gapi;

import { GAPIError } from './google'

import _retry from 'async/retry'
import drive from '.'

class ChangeMonitor  {

  constructor() {
    this._timer = null;
    this._pageToken = null;
    this._eventBus = new Vue();
  }

  subscribe(handler) {
    this._eventBus.$on('drivechanged', handler);
  }

  unsubscribe(handler) {
    this._eventBus.$off('drivechanged', handler);
  }

  start(interval = 30000) {
    this.stop();
    let thiz = this;
    return this.ensurePageToken()
      .then(() => {
        this._timer = setInterval(() => { 
          thiz.check();
        }, interval);
      })
  }

  check() {
    this.ensurePageToken()
      .then(() => {
        return gapi.client.drive.changes.list({
          pageToken: this._pageToken,
          restrictToMyDrive: true,
          supportsTeamDrives: true
        })
      })
      .then(response => {
        this._pageToken = response.result.nextPageToken ||
                          response.result.newStartPageToken;
        let changes = response.result.changes;
        if (changes.length > 0)
          this._eventBus.$emit('drivechanged', changes);
      })
      .catch(() => {
        this._pageToken = null;
      });
  }

  stop() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
    this._pageToken = null;
  }

  ensurePageToken() {
    if (this._pageToken !== null) {
      return Promise.resolve();
    } else {
      return gapi.client.drive.changes.getStartPageToken({
        supportsTeamDrives: true
      })
      .then(response => {
        this._pageToken = response.result.startPageToken;
      })
      .catch(response => {
        return Promise.reject(new GAPIError(response.result.error));
      });
    }
  }
}


export default new ChangeMonitor();


export function docSyncHandler(
  docId, docInfo, onSyncMetadata, onSyncDoc, onSyncError) {
    
  function onDriveChanged(changes) {

    let thisDocChange = changes.find(change => change.fileId === docId);
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
            .getFileMetadata(docId)
            .then(metadata => {
              let doc = docInfo();
              // if the change has a different revisionId then get the file
              if (metadata.headRevisionId !== doc.headRevisionId) {
                return drive.getFile(docId)
              // otherwise sync metadata
              } else {
                onSyncMetadata(metadata);
              } 
            })
            .then(doc => {
              if (doc)
                onSyncDoc(doc);
              callback(null, null);
            })
            .catch(error => {
              callback(error, null);
            });
        },

        // result function
        error => {
          if (error)
            onSyncError(error);
        }
      );
    }
  }

  return onDriveChanged;
}





