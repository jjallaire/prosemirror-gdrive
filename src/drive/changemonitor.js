

import Vue from 'vue'

const gapi = window.gapi;

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

  start(interval = 10000) {
    
    this.stop();

    return gapi.client.drive.changes.getStartPageToken({
      supportsTeamDrives: true
    })
    .then(response => {
      this._pageToken = response.result.startPageToken;
      let thiz = this;
      this._timer = setInterval(() => { 
        gapi.client.drive.changes.list({
          pageToken: thiz._pageToken,
          restrictToMyDrive: true,
          supportsTeamDrives: true
        })
        .then(response => {
          thiz._pageToken = response.result.newStartPageToken;
          let changes = response.result.changes;
          if (changes.length > 0)
            thiz._eventBus.$emit('drivechanged', changes);
        }) 
      }, interval);
    });

  }

  stop() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
    this._pageToken = null;
  }
}


export default new ChangeMonitor();




