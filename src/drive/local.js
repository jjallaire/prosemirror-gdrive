

import config from '../config'

import localforage from 'localforage'
import shortUuid from 'short-uuid'

import store from '../store'
import { SET_INITIALIZED, SET_USER } from '../store/mutations'

import { initSettings } from './settings'

const kUserAppData = "user.json"
const kUserMimeType = "application/json; charset=UTF-8"

var appDataStore = localforage.createInstance({
  name: config.app.storage,
  storeName: "appData"
});

var docStore = localforage.createInstance({
  name: config.app.storage,
  storeName: "docs"
});

export default {

  connect() {
    return this.readAppData(kUserAppData, kUserMimeType, null)
      .then(file => {
        let user = file.content;
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
      });
  },


  listFiles() {
    let files = [];
    return docStore.iterate(function(value, key) {
      files.push({
        id: key,
        name: value.metadata.name,
        icon: null,
        owner: "Me",
        shared: false,
        lastViewed: new Date().getTime(),
        size: value.content.length 
      });
    }).then(function() {
      return files;
    })
  },

  newFile(title, content) {

    let id = shortUuid().new();
    
    let file = {
      metadata: {
        'name': title,
        'mimeType': config.gdrive.studentAssignmentMimeType,
      },
      content: content
    };
   
    return docStore.setItem(id, file)
      .then(() => {
        return this._uploadResponse(id);
      });    

  },

  // eslint-disable-next-line
  saveFile(fileId, content) {
    return docStore
      .getItem(fileId)
      .then(file => {
        file.content = content;
        return docStore.setItem(fileId, file);
      })
      .then(() => {
        return this._uploadResponse(fileId);
      });
  },


  renameFile(fileId, name) {
    return docStore
      .getItem(fileId)
      .then(file => {
        file.metadata.name = name;
        return docStore.setItem(fileId, file);
      })
      .then(() => {
        return this._uploadResponse(fileId);
      });
  },

  // eslint-disable-next-line
  convertToGoogleDoc(title, content, contentMimeType) {
  },

  getFile(fileId) {
    return docStore.getItem(fileId);
  },

  getFileMetadata(fileId) {
    return docStore
      .getItem(fileId)
      .then(file => {
        return file.metadata;
      })
  },


  removeFile(fileId) {
    return docStore.removeItem(fileId);
  },

  // eslint-disable-next-line
  setFileViewed(fileId) {
    // no-op
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

  selectFile() {
    return new Promise(() => {

    });
  },

  // eslint-disable-next-line
  shareFileDialog(fileId) {
    // no-op
  },

  _uploadResponse(fileId) {
    return {
      id: fileId,
      headRevisionId: fileId
    }
  }
};
