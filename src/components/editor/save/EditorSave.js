import _throttle from 'lodash/throttle'

import drive from '../../../drive'


export default {


  data: function() {
    return {

      // track updates
      editor_updates: {
        last: null,
        last_save_time: null
      },

      // save errors
      save_error: null,

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
      this.editor_updates.last = update;
      this.saveLastUpdateThrottled();
    },

    // called on a throttled basic (no more than every 3 seconds)
    // to save the editor contents to drive
    saveLastUpdate() {

      // reset error status
      this.save_error = null;

      // attempt save to drive
      let update = this.editor_updates.last;
      drive
        .saveFile(
          this.doc_id, 
          JSON.stringify(update.getJSON()), 
          update.getHTML()
        )
        .then(() => {
          this.editor_updates.last_save_time = update.transaction.time;
        })
        .catch(error => {

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

            // TODO: exponential retry
            console.log("Error code: " + error.code);
          }

          // set error status 
          this.save_error = 
            "Unable to save changes (" + message + "). " +
            "Please ensure you are online so that you don't lose work.";
        });
    },

    resetSaveStatus() {
      this.editor_updates = {
        last: null,
        last_save_time: null
      };
      this.save_error = null;
    }

  }

}