import _throttle from 'lodash/throttle'
import _retry from 'async/retry'

import drive from '../../../drive'
import dialog from '../../core/dialog'

export default {


  data: function() {
    return {

      // track updates
      editor_updates: {
        last: null,
        last_save_time: null
      },

      // track wheter we have a save last update pending
      save_last_update_pending: false,

      // throttled version of saveLastUpdate
      saveLastUpdateThrottled: _throttle(
        this.saveLastUpdate,
        3000, 
        { leading: false, trailing: true }
      )
    }
  },

  methods: {

    // called with each and every update to the editor
    onEditorUpdate(update) {

      // record last update
      this.editor_updates.last = update;

      // schedule a save 
      this.saveLastUpdateThrottled();
    },

    // called on a throttled basis (no more than every 3 seconds)
    saveLastUpdate() {

      // if we already have an async operation pending that will save the 
      // last update, then this is a no-op
      if (this.save_last_update_pending)
        return;

      // note that we have a save in flight
      this.save_last_update_pending = true;

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
                this.save_last_update_pending = true;
              
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
          this.save_last_update_pending = false;
          
          // perform save
          let update = this.editor_updates.last;
          drive
            .saveFile(
              this.doc_id, 
              JSON.stringify(update.getJSON()), 
              update.getHTML()
            )
            // eslint-disable-next-line
            .then(result => {
              this.doc.headRevisionId = result.headRevisionId;
              callback(null, update.transaction.time);
            })
            .catch(error => {
              callback(error, null);
            });
        },

        // result function
        (error, result) => {

          // success! (record last save time)
          if (result) {

            this.editor_updates.last_save_time = result;

          // error (display to user)
          } else if (error) {

            // update is no longer pending
            this.save_last_update_pending = false;

            // default error code and message
            let code = null;
            let message = error.message;

            // handle GAPIError
            if (error.name === "GAPIError") {

              // record code
              code = error.code;

              // add code to message if we have one
              if (code > 0)
                message = error.code + " - " + message;
            }

            // show error snackbar
            dialog.errorSnackbar(
              "Unable to save changes (" + message + "). " +
              "Please ensure you are online so that you don't lose work."
            );
          }
        }
      );
    },

  }

}