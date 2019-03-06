

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

const gapi = window.gapi;

import MultipartBuilder from './multipart'
import store from '../store'
import { SET_RECENT_FILES } from '../store/mutations'

export class GAPIError extends Error {
  constructor(error) {
    super(error.message); 
    this.name = "GAPIError";
    this.domain = error.domain;
    this.location =  error.location;
    this.locationType = error.locationType;
    this.reason = error.reason;
  }
}

export default {


  connect(onSignInChanged) {

    return new Promise((resolve, reject) => {
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
          auth().isSignedIn.listen(onSignInChanged);
          return this.updateRecentFiles();
        })
        .then(() => {
          resolve();
        })
        .catch(error => {
          let message = error.error.errors[0].message;
          reject(new Error(message));
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

  signedInUser() {
    if (auth().isSignedIn.get()) {
      let user = auth().currentUser.get();
      let profile = user.getBasicProfile();
      return Promise.resolve({
        id: profile.getId(),
        name: profile.getName(),
        email: profile.getEmail()
      });
    } else {
      return Promise.resolve(null);
    }
  },

  listFiles() {
    return gapi.client.drive.files.list({
      q: 'mimeType="application/vnd.google.drive.ext-type.pmdoc"',
      pageSize: 100,
      fields: 'nextPageToken, files(id, name)',
      orderBy: 'recency desc'
    }).then(response => {
      return response.result.files;
    });  
  },

  newFile() {
    let fileContent = 'more sample text'; 
    let metadata = {
      'name': 'Brand New Doc',
      'mimeType': 'application/vnd.google.drive.ext-type.pmdoc',
    };
    let path = '/upload/drive/v3/files';
    let method = 'POST';
    let multipart = new MultipartBuilder()
      .append('application/json', JSON.stringify(metadata))
      .append('application/vnd.google.drive.ext-type.pmdoc', fileContent)
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
      // update model w/ new file
      this.updateRecentFiles();

      // return id
      return response.result.id;
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
      .catch(error => {
        let err = error.result.error.errors[0];
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
      let picker = new api.PickerBuilder()
        .setAppId(kAppId)
        .setOAuthToken(user.getAuthResponse().access_token)
        .enableFeature(api.Feature.SUPPORT_TEAM_DRIVES)
        .setSelectableMimeTypes('application/vnd.google.drive.ext-type.pmdoc')
        .addView(view)
        .addView(api.ViewId.FOLDERS)
        .setCallback(data => {
          if (data[api.Response.ACTION] === api.Action.PICKED)
            resolve(data.docs[0]);
        }).build();
      picker.setVisible(true);
    });
  },

  // update the store with recent files. this is done on startup,
  // after a new file is created, and periodically in the background
  updateRecentFiles() {

    return this.listFiles().then(files => {
      store.commit(SET_RECENT_FILES, files);
    });

    // we can query this endpoint for changes:
    // https://developers.google.com/drive/api/v3/reference/changes/list
    // perhaps force a query when we know one should have occurred
  }

};





function auth() {
  return gapi.auth2.getAuthInstance();
}
