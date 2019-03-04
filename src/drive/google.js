

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

export default {

  connect(onSignInChanged) {
    return new Promise((resolve, reject) => {
      return gapi.load('client:auth2:picker', () => {
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
      pageSize: 10,
      fields: 'nextPageToken, files(id, name)'
    }).then(response => {
      return response.result.files;
    });  
  },

  openFile() {
    return new Promise((resolve) => {
      let api = gapi.picker.api;
      let user = auth().currentUser.get();
      let view = new api.DocsView(api.ViewId.DOCS)
        .setMode(api.DocsViewMode.LIST);
      let picker = new api.PickerBuilder()
        .setAppId(kAppId)
        .setOAuthToken(user.getAuthResponse().access_token)
        .addView(view)
        .addView(api.ViewId.FOLDERS)
        .setCallback(data => {
          if (data[api.Response.ACTION] === api.Action.PICKED)
            resolve(data.docs[0]);
        }).build();
      picker.setVisible(true);
    });
  }

};


function auth() {
  return gapi.auth2.getAuthInstance();
}
