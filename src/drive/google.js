

const kAppId = "880472811488"
const kClientId = "880472811488-1hm06rum32dj0g28hkcedfb6h456ll4l.apps.googleusercontent.com"
const kApiKey =  process.env.VUE_APP_API_KEY || "AIzaSyCT-dDWWmNJawfBf-Lot471GGtQrYk1fMQ"
const kDiscoveryDocs = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]

// see: https://developers.google.com/drive/api/v2/about-auth#OAuth2Authorizing
const kScopes = [
  'email', 
  'profile', 
  'https://www.googleapis.com/auth/drive.appfolder',         // application data folder 
  'https://www.googleapis.com/auth/drive.file',              // files created by this app
  'https://www.googleapis.com/auth/drive.metadata.readonly', // read-only metadata
  'https://www.googleapis.com/auth/drive.install'            // installation of the app onto drive
];

const kFileListFields = 'nextPageToken, files(id, name, iconLink, modifiedTime, sharingUser, size)'

const gapi = window.gapi;

import MultipartBuilder from './multipart'
import { initSettings } from './settings'
import changemonitor from './changemonitor'

import store from '../store'
import { SET_INITIALIZED, SET_INIT_ERROR, SET_USER, SET_RECENT_DOCS } from '../store/mutations'


class GAPIError extends Error {
  constructor(error) {
    super(error.message); 
    this.name = "GAPIError";
    this.domain = error.domain;
    this.reason = error.reason;
    this.location =  error.location;
    this.locationType = error.locationType;
  }
}


export default {

  connect() {

    return new Promise((resolve) => {
      return gapi.load('client:auth2:picker:drive-share', () => {
        gapi.client.init({
          apiKey: kApiKey,
          clientId: kClientId,
          discoveryDocs: kDiscoveryDocs,
          scope: kScopes.join(' '),
          ux_mode: 'redirect',
          redirect_uri: window.location.origin + "/"
        })
        .then(() => {
          
          // if we are signed in then initialize
          if (this.isSignedIn()) {

            // initialize settings before continuing
            initSettings().then(() => {
               
              // set user
              store.commit(SET_USER, this.signedInUser());

              // listen for sign-out
              auth().isSignedIn.listen(() => {
                if (!this.isSignedIn()) {
                  changemonitor.stop();
                  this._clearRecentDocs();
                  store.commit(SET_USER, null);
                }
              });

              // subscribe to drive changes
              changemonitor.subscribe(() => {
                this.updateRecentDocs();
              });

              // listen for changes then update recent files
              changemonitor.start();
              this.updateRecentDocs();
              store.commit(SET_INITIALIZED, true);
              resolve();

            });
            
          // signed out, initialize w/o drive state populated
          } else {
            store.commit(SET_INITIALIZED, true);
            resolve();
          }
        })
        .catch(error => {
          store.commit(SET_INIT_ERROR, new GAPIError(error.error.errors[0]));
          resolve();
        });
      });

    });
  },

  signIn() {
    auth().signIn();
  },

  signOut() {
    auth().signOut();
  },

  isSignedIn() {
    return auth().isSignedIn.get();
  },

  signedInUser() {
    if (this.isSignedIn()) {
      let user = auth().currentUser.get();
      let profile = user.getBasicProfile();
      return {
        id: profile.getId(),
        name: profile.getName(),
        email: profile.getEmail()
      };
    } else {
      return null
    }
  },

  listFiles() {
    return gapi.client.drive.files.list({
      q: 'mimeType="application/vnd.google.drive.ext-type.pmdoc" and trashed = false',
      pageSize: store.getters.settings.document_history,
      fields: kFileListFields,
      orderBy: 'recency desc'
    }).then(fileListResponse);  
  },

  newFile(title) {
    let metadata = {
      'name': title,
      'mimeType': 'application/vnd.google.drive.ext-type.pmdoc',
    };
    let fileContent = 'more sample text'; 
    return uploadFile(metadata, fileContent).then(file => {

        // update model w/ new file (async)
        this.updateRecentDocs();

        return file.id;
    });
  },
  

  loadFile(fileId) {
    let metadataRequest = gapi.client.drive.files.get({
      fileId: fileId,
      supportsTeamDrives: true
    });
    var contentRequest = gapi.client.drive.files.get({
      fileId: fileId,
      supportsTeamDrives: true,
      alt: 'media'
    });
    return Promise.all([metadataRequest, contentRequest])
      .then(responses => {
        let file = {
          metadata: responses[0].result,
          content: responses[1].body
        };
        return file; 
      })
      .catch(response => {
        let err = response.result.error.errors[0];
        return Promise.reject(new GAPIError(err));
      });
  },

  shareFile(fileId) {
    let user = auth().currentUser.get();
    let share = new gapi.drive.share.ShareClient();
    share.setOAuthToken(user.getAuthResponse().access_token);
    share.setItemIds([fileId]);
    share.showSettingsDialog();
  },

  openFile() {
    return new Promise((resolve) => {
      let api = gapi.picker.api;
      let user = auth().currentUser.get();
      let view = new api.DocsView(api.ViewId.DOCS)
        .setMode(api.DocsViewMode.LIST)
        .setMimeTypes('application/vnd.google.drive.ext-type.pmdoc');
      let folderView = new api.DocsView(api.ViewId.FOLDERS)
        .setMimeTypes('application/vnd.google.drive.ext-type.pmdoc');
    
      let picker = new api.PickerBuilder()
        .setAppId(kAppId)
        .setOAuthToken(user.getAuthResponse().access_token)
        .enableFeature(api.Feature.SUPPORT_TEAM_DRIVES)
        .setSelectableMimeTypes('application/vnd.google.drive.ext-type.pmdoc')
        .addView(view)
        .addView(api.ViewId.RECENTLY_PICKED)
        .addView(folderView)
        .setCallback(data => {
          if (data[api.Response.ACTION] === api.Action.PICKED)
            resolve(data.docs[0]);
        }).build();
      picker.setVisible(true);
    });
  },


  removeFile(fileId) {
    return gapi.client.drive.files.delete({
      fileId: fileId,
      supportsTeamDrives: true
    })
    .then(() => {

    })
    .catch(response => {
      return Promise.reject(new GAPIError(response.result.error.errors[0]));
    });
  },

  
  readAppData(id, name, mimeType, defaultContent) {
    if (id) {
      return this.loadFile(id);
    } else {
      return gapi.client.drive.files.list({
        fields: kFileListFields,
        pageSize: 1000,
        spaces: "appDataFolder"
      })
      .then(response => {
        let fileList = fileListResponse(response);
        let file = fileList.find(file => file.name === name);
        if (file !== undefined) {
          return this.loadFile(file.id);
        } else {
          return this.writeAppData(null, name, mimeType, defaultContent)
            .then(id => {
              return this.loadFile(id);
            });
        }
      });
    }
  },

  writeAppData(id, name, mimeType, content) {
    return uploadFile({
      id: id,
      name: name,
      mimeType: mimeType,
      parents: ["appDataFolder"]
    }, content);
  },


  updateRecentDocs() {
    return this.listFiles().then(files => {
      store.commit(SET_RECENT_DOCS, files);
    });
  },

  _clearRecentDocs() {
    store.commit(SET_RECENT_DOCS, []);
  },
  

};


function auth() {
  return gapi.auth2.getAuthInstance();
}

function fileListResponse(response) {
  return response.result.files.map(file => {
    let owner = "Me";
    if (file.sharingUser && !file.sharingUser.me)
      owner = file.sharingUser.displayName;
    return {
      id: file.id,
      name: file.name,
      icon: file.iconLink,
      owner: owner,
      modifiedTime: Date.parse(file.modifiedTime),
      size: parseInt(file.size)
    }
  });  
}

function uploadFile(metadata, content) {
  let path = '/upload/drive/v3/files' + (metadata.id ? ('/' + metadata.id) : '');
  let method = metadata.id ? 'PATCH' : 'POST';
  let uploadMetadata = metadata.id ? 
    { name: metadata.name, mimeType: metadata.mimeType } : 
    metadata;
  let multipart = new MultipartBuilder()
    .append('application/json', JSON.stringify(uploadMetadata))
    .append(metadata.mimeType, content)
    .finish();
  return gapi.client.request({
    path: path,
    method: method,
    params: {
      uploadType: 'multipart',
      supportsTeamDrives: true,
      fields: 'id'
    },
    headers: { 'Content-Type' : multipart.type },
    body: multipart.body
  }).then(response => {
    // return id
    if (response.result.id)
      return response.result.id;
    else
      return response.result.result.id;
  }).catch(response => {
    if (response.result === false)
      return Promise.reject(new Error("Error " + response.status + ": " + response.body));
    else
      return Promise.reject(new Error("Error uploading document to Google Drive"));
  });
}
