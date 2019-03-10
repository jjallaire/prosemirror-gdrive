

import localforage from 'localforage'

import store from '../store'
import { SET_INITIALIZED, SET_USER, SET_RECENT_DOCS } from '../store/mutations'

import { initSettings } from './settings'

const kUserAppData = "user.json"
const kUserMimeType = "application/json"

var appDataStore = localforage.createInstance({
  name: "promisemirror-gdrive",
  storeName: "appData"
});

var docStore = localforage.createInstance({
  name: "promisemirror-gdrive",
  storeName: "docs"
});

export default {

  connect() {
    return this._signedInUser()
      .then(user => {
        store.commit(SET_USER, user);
        if (user) {
          initSettings()
            .then(() => {
              store.commit(SET_INITIALIZED, true);
            });
        } else {
          store.commit(SET_INITIALIZED, true);
        }
      });
  },

  signIn() {
    let user = {
      id: 1,
      name: "Local User",
      email: "user@localhost"
    };
    this.writeAppData(kUserAppData, kUserMimeType, user)
      .then(() => {
        store.commit(SET_USER, user);
      });
  },

  signOut() {
    this.writeAppData(kUserAppData, kUserMimeType, null)
      .then(() => {
        store.commit(SET_USER, null);
        store.commit(SET_RECENT_DOCS, []);
      });
  },

 

  listFiles() {
    return Promise.resolve([]);
  },

  newFile(title) {

    

  },

  loadFile(fileId) {

    // return { metadata, content } 
  },

  shareFile(fileId) {
    // no-op
  },

  selectFile() {
    return new Promise((resolve) => {

      // return id

    });
  },

  removeFile() {


  },

  readAppData(name, mimeType, defaultContent) {
    
    function appDataFile(content) {
      return {
        metadata: {
          name: name,
          mimeType: mimeType
        },
        content: content
      }
    }
    
    return appDataStore
      .getItem(name)
      .then(content => {
        if (content) {
          return appDataFile(content);
        } else {
          return this.writeAppData(name, mimeType, defaultContent)
            .then(() => {
              return appDataFile(defaultContent);
            });
        }

      });

  },

  writeAppData(name, mimeType, content) {
    return appDataStore
      .setItem(name, content)
      .then(() => {
        return name;
      });
  },

  updateRecentDocs() {
    return this.listFiles().then(files => {
      store.commit(SET_RECENT_DOCS, files);
    });
  },

  _signedInUser() {
    return this.readAppData(kUserAppData, kUserMimeType, null);
  },

};
