

import config from '../config'

const kDiscoveryDocs = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]

// see: https://developers.google.com/drive/api/v2/about-auth#OAuth2Authorizing
const kScopes = [
  'email', 
  'profile', 
  'https://www.googleapis.com/auth/drive.appfolder',         // application data folder 
  'https://www.googleapis.com/auth/drive.file',              // files created by this app
  'https://www.googleapis.com/auth/drive.metadata.readonly', // read-only metadata
  'https://www.googleapis.com/auth/drive.install',           // installation of the app onto drive
  'https://picasaweb.google.com/data/'                       // picasa photo albums
];

const kFileFields = 'id, name, headRevisionId, iconLink, viewedByMe, viewedByMeTime, ' +
                    'sharedWithMeTime, modifiedTime, shared, sharingUser, size, properties, appProperties';

const kFileListFields = 'nextPageToken, files(' + kFileFields + ')';

const gapi = window.gapi;

import _orderBy from 'lodash/orderBy'

import MultipartBuilder from './multipart'
import { initSettings } from './settings'
import driveChanges from './changes'

import { jsonStringifyEscaped } from '../core/json'

import store from '../store'
import { SET_INITIALIZED, SET_INIT_ERROR, SET_USER, SET_RECENT_DOCS } from '../store/mutations'


export class GAPIError extends Error {
  constructor(error) {
    super(error.message); 
    this.name = "GAPIError";
    this.code = error.code;
    if (error.errors) {
      let cause = error.errors[0];
      this.domain = cause.domain;
      this.reason = cause.reason;
      this.location =  cause.location;
      this.locationType = cause.locationType;
    }
  }
}


export default {

  connect() {

    return new Promise((resolve) => {
      return gapi.load('client:auth2:picker:drive-share', () => {
        gapi.client.init({
          apiKey: config.gdrive.apiKey,
          clientId: config.gdrive.clientId,
          discoveryDocs: kDiscoveryDocs,
          scope: kScopes.join(' '),
          ux_mode: 'redirect',
          redirect_uri: window.location.origin + "/"
        })
        .then(() => {
          
          // if we are signed in then initialize
          if (this._isSignedIn()) {

            // initialize settings before continuing
            initSettings().then(() => {
               
              // set user
              store.commit(SET_USER, this._signedInUser());

              // listen for sign-out
              auth().isSignedIn.listen(() => {
                if (!this._isSignedIn()) {
                  driveChanges.stop();
                  this._clearRecentDocs();
                  store.commit(SET_USER, null);
                }
              });

              // subscribe to drive changes
              driveChanges.subscribe(() => {
                this.updateRecentDocs();
              });

              // listen for changes 
              return driveChanges.start();
            })
            .then(() => {
              return this.updateRecentDocs();
            })
            .then(() => {
              store.commit(SET_INITIALIZED, true);
              resolve();
            })
            .catch(error => {
              store.commit(SET_INIT_ERROR, error);
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

  // properties is a string that uses the syntax described here:
  //  https://developers.google.com/drive/api/v3/search-parameters#properties
  // for example:
  //  properties has { key='foo' and value='bar' } 
  listFiles(options) {

    // provide defaults
    options = {
      orderBy: 'lastViewed',
      descending: true,
      search: null,
      properties: null,
      limit: 1000,
      ...options
    }

    // adjust order by to cannonical names
    let orderByQuery = options.orderBy;
    if (orderByQuery === 'lastViewed')
      orderByQuery = 'viewedByMeTime';
    else if (orderByQuery === 'size')
      orderByQuery = 'quotaBytesUsed';
      
    // build query
    let query = `appProperties has { key="appId" and value="${config.gdrive.appId}" } and trashed = false`
    if (options.properties) {
      query = query + " and (" + options.properties + ") "
    }
    if (options.search) {
      query = query + " and fullText contains '" + options.search.replace("'", "\\'") + "'";  
    }

    // build params
    let params = {
      q: query,
      pageSize: options.limit,
      fields: kFileListFields
    };

    // add orderBy if this isn't a search
    if (options.orderBy && !options.search)
      params.orderBy = orderByQuery + (options.descending ? ' desc' : '');

    // perform query
    return gapi.client.drive.files.list(params)
      .then(fileListResponse)
      .then(files => {
        // do client side sorting if this was a search
        if (options.orderBy && options.search) 
          return _orderBy(files, [options.orderBy], [options.descending ? 'desc' : 'asc']);
        else
          return files;
      })
      .catch(response => {
        return Promise.reject(new GAPIError(response.result.error));
      }); 
  },

  newFile(title, properties) {
    let metadata = {
      name: title,
      mimeType: 'text/html; charset=UTF-8',
      appProperties: {
        appId: config.gdrive.appId,
      },
      properties: {
        ...properties
      }
    };
    let fileContent = ''; 
    return this._uploadFile(metadata, fileContent);
  },
  
  saveFile(fileId, content) {
    let metadata = {
      id: fileId,
      mimeType: 'text/html; charset=UTF-8',
      viewedByMeTime: new Date().toISOString()
    }
    return this._uploadFile(metadata, content);
  },

  renameFile(fileId, name) {
    return this._uploadFileMetadata(fileId, { 
      name: name
    });
  },

  setFileViewed(fileId) {
    return this._uploadFileMetadata(fileId, { 
      viewedByMeTime: new Date().toISOString()
    })
  },

  // NOTE: limited to 30 properties, and each property 
  // can use 124 bytes combined for key and value
  // see: https://developers.google.com/drive/api/v3/properties
  setFileProperties(fileId, properties) {
    return this._uploadFileMetadata(fileId, { 
      properties: properties
    });
  },

  getFile(fileId) {
    let metadataRequest = gapi.client.drive.files.get({
      fileId: fileId,
      supportsTeamDrives: true,
      fields: kFileFields
    });
    let contentRequest = gapi.client.drive.files.get({
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
        return Promise.reject(new GAPIError(response.result.error));
      });
  },

  getFileMetadata(fileId) {
    return gapi.client.drive.files
      .get({
        fileId: fileId,
        supportsTeamDrives: true,
        fields: kFileFields
      })
      .then(response => {
        return response.result;
      })
      .catch(response => {
        return Promise.reject(new GAPIError(response.result.error));
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
      return Promise.reject(new GAPIError(response.result.error));
    });
  },

  convertToGoogleDoc(fileId) {
    return this.getFile(fileId)
      .then(file => {
        let metadata = {
          name: file.metadata.name,
          mimeType: 'application/vnd.google-apps.document'
        };
        return this._uploadFile(metadata, file.content);
      });
  },

  readAppData(name, mimeType, defaultContent) {
    return this._appDataFileId(name)
      .then(fileId => {
        if (fileId) {
          return this.getFile(fileId);
        } else {
          return this.writeAppData(name, mimeType, defaultContent)
            .then(result => {
              return this.getFile(result.id);
            });
        }
      });
  },

  writeAppData(name, mimeType, content) {
    return this._appDataFileId(name)
      .then(fileId => {
        return this._uploadFile({
          id: fileId,
          name: name,
          mimeType: mimeType,
          parents: ["appDataFolder"]
        }, content);
      }); 
  },

  selectFile() {
    return new Promise((resolve) => {
      let api = gapi.picker.api;
      let user = auth().currentUser.get();
      let view = new api.DocsView(api.ViewId.DOCS)
        .setMode(api.DocsViewMode.LIST)
        .setMimeTypes('application/vnd.google.drive.ext-type.pmdoc');
      let folderView = new api.DocsView(api.ViewId.FOLDERS)
        .setMimeTypes('application/vnd.google.drive.ext-type.pmdoc');
    
      let picker = new api.PickerBuilder()
        .setAppId(config.gdrive.appId)
        .setOAuthToken(user.getAuthResponse().access_token)
        .enableFeature(api.Feature.SUPPORT_TEAM_DRIVES)
        .setSelectableMimeTypes('application/vnd.google.drive.ext-type.pmdoc')
        .addView(view)
        .addView(api.ViewId.RECENTLY_PICKED)
        .addView(folderView)
        .setCallback(data => {
          if (data[api.Response.ACTION] === api.Action.PICKED)
            resolve(data.docs[0].id);
        }).build();
      picker.setVisible(true);
    });
  },

  selectImage() {
    return new Promise((resolve) => {
      let api = gapi.picker.api;
      let user = auth().currentUser.get();
      let searchView = new api.ImageSearchView();
      let picker = new api.PickerBuilder()
        .setAppId(config.gdrive.appId)
        .setOAuthToken(user.getAuthResponse().access_token)
        .enableFeature(api.Feature.SUPPORT_TEAM_DRIVES)
        .addView(api.ViewId.PHOTO_UPLOAD)
        .addView(api.ViewId.PHOTOS)
        .addView(searchView)
        .setCallback(data => {
          if (data[api.Response.ACTION] === api.Action.PICKED) {
            let thumbnails = data[api.Response.DOCUMENTS][0][api.Document.THUMBNAILS];
            let thumbnail = thumbnails[thumbnails.length - 1];
            resolve(thumbnail[api.Thumbnail.URL]);
          }
        }).build();
      picker.setVisible(true);
    });

  },

  shareFile(fileId) {
    let user = auth().currentUser.get();
    let share = new gapi.drive.share.ShareClient();
    share.setOAuthToken(user.getAuthResponse().access_token);
    share.setItemIds([fileId]);
    share.showSettingsDialog();
  },

  updateRecentDocs() {
    return this
      .listFiles({
        orderBy: 'recency', 
        limit: store.getters.settings.recent_documents
      })
      .then(files => {
        store.commit(SET_RECENT_DOCS, files);
      })
  },

  _appDataFileId(name) {
    return gapi.client.drive.files
      .list({
        fields: kFileListFields,
        pageSize: 1000,
        spaces: "appDataFolder"
      })
      .then(response => {
        let fileList = fileListResponse(response);
        let file = fileList.find(file => file.name === name);
        if (file)
          return file.id;
        else
          return null;
      })
      .catch(response => {
        return Promise.reject(new GAPIError(response.result.error));
      });
  },

  _clearRecentDocs() {
    store.commit(SET_RECENT_DOCS, []);
  },

  _isSignedIn() {
    return auth().isSignedIn.get();
  },

  _signedInUser() {
    if (this._isSignedIn()) {
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

  _uploadFileMetadata(fileId, metadata) {
    let path = '/drive/v3/files/' + fileId;
    let method = 'PATCH'
    return gapi.client.request({
      path: path,
      method: method,
      params: {
        supportsTeamDrives: true,
        fields: 'id,properties,headRevisionId'
      },
      headers: { 'Content-Type' : "application/json; charset=UTF-8" },
      body: jsonStringifyEscaped(metadata)
    })
    .then(result => {
      return handleUploadResponse(result);
    })
    .catch(catchHttpRequest);
  },

  _uploadFile(metadata, content) {
    let path = '/upload/drive/v3/files' + (metadata.id ? ('/' + metadata.id) : '');
    let method = metadata.id ? 'PATCH' : 'POST';
    let uploadMetadata = metadata.id ? 
      { name: metadata.name, mimeType: metadata.mimeType } : 
      metadata;
    uploadMetadata = { 
      ...uploadMetadata,
    };
    let multipart = new MultipartBuilder()
      .append('application/json; charset=UTF-8', jsonStringifyEscaped(uploadMetadata))
      .append('text/html; charset=UTF-8', content)
      .finish();
    return gapi.client.request({
      path: path,
      method: method,
      params: {
        uploadType: 'multipart',
        supportsTeamDrives: true,
        fields: 'id,properties,headRevisionId'
      },
      headers: { 'Content-Type' : multipart.type },
      body: multipart.body
    })
    .then(handleUploadResponse)
    .catch(catchHttpRequest);
  },
};


function auth() {
  return gapi.auth2.getAuthInstance();
}

function fileListResponse(response) {
  return response.result.files.map(file => {
    
    // establish owner
    let owner = "Me";
    if (file.sharingUser && !file.sharingUser.me)
      owner = file.sharingUser.displayName;

    // establish time
    let lastViewed = file.modifiedTime;
    if (file.viewedByMe)
      lastViewed = file.viewedByMeTime;
    else if (file.sharedWithMeTime)
      lastViewed = file.sharedWithMeTime;

    return {
      id: file.id,
      name: file.name,
      icon: file.iconLink,
      owner: owner,
      shared: file.shared,
      lastViewed: Date.parse(lastViewed),
      size: parseInt(file.size)
    }
  });  
}

function handleUploadResponse(response) {
  if (response.result.id)
    return response.result;
  else
    return response.result.result;
}

function catchHttpRequest(response) {
  if (response.result === false)
    return Promise.reject(new Error("Error " + response.status + ": " + response.body));
  else if (response.result && response.result.error)
    return Promise.reject(new GAPIError(response.result.error));
  else
    return Promise.reject(new Error("Error making HTTP request to Google Drive"));
}
