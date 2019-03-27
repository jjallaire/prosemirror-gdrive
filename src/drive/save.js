

import _throttle from 'lodash/throttle'
import _retry from 'async/retry'

import drive from '.'

import { jsonStringifyEscaped } from '../core/json'

export default class DriveSave  {

  constructor(docId, onStatus, onSaved, onSaveError) {

    // doc id and callbacks
    this._docId = docId;
    this._onStatus = onStatus;
    this._onSaved = onSaved;
    this._onSaveError = onSaveError;

    // track updates
    this._editorUpdates = {
      last: null,
      lastSaveTime: null
    };
    this._emitStatus();

    // track wheter we have a save last update pending
    this._saveLastUpdatePending = false;

    // throttled version of saveLastUpdate
    this._saveLastUpdateThrottled = _throttle(
      this.saveLastUpdate,
      3000, 
      { leading: false, trailing: true }
    )
  }

  // callback for editor updates
  onEditorUpdate(update) {

    // record last update
    this._editorUpdates.last = update;
    this._emitStatus();

    // schedule a save 
    this._saveLastUpdateThrottled();
  }

  saveLastUpdate() {

    // if we already have an async operation pending that will save the 
    // last update, then this is a no-op
    if (this._saveLastUpdatePending)
      return;

    // note that we have a save in flight
    this._saveLastUpdatePending = true;

    _retry(
      {
        // retry up to 5 times
        times: 5,

        // use exponential backoff (2s, 4s, 8s, 16s, 32s)
        interval: function(retryCount) {
          return 1000 * Math.pow(2, retryCount);
        },

        // error retry filter
        errorFilter: (error) => {
          if (error.name === "GAPIError") {

            // check wheter we should retry
            let retry = error.code === -1 || error.code === 429 || error.code >= 500;
            
            // if we are going to retry then note that we have a save pending
            if (retry)
              this._saveLastUpdatePending = true;
            
            // return retry status
            return retry;

          } else {
            return false;
          }
        }
      },

      // save function
      callback => {
        
        // we are going to collect the last update, so we no longer
        // have a save in flight that will cover subsequent updates
        this._saveLastUpdatePending = false;
        
        // perform save
        let update = this._editorUpdates.last;
        drive
          .saveFile(
            this._docId, 
            jsonStringifyEscaped(update.getJSON()), 
            update.getHTML()
          )
          .then(result => {
            this._editorUpdates.lastSaveTime = update.time;
            this._emitStatus();
            callback(null, result);
          })
          .catch(error => {
            callback(error, null);
          });
      },

      // result function
      (error, result) => {

        // success! 
        if (result) {

          this._onSaved(result);

        // error (display to user)
        } else if (error) {

          // update is no longer pending
          this._saveLastUpdatePending = false;

          this._onSaveError(error);
        }
      }
    );
  }

  // emit the current save status
  _emitStatus() {
      
    let status = null
    if (this._editorUpdates.last === null) {
      status = "clean";
    } else if (this._editorUpdates.lastSaveTime === null ||
               this._editorUpdates.last.transaction.time > this._editorUpdates.lastSaveTime) {
      status = "dirty";      
    } else {
      status = "saved";
    }

    this._onStatus(status);


  }
  

}