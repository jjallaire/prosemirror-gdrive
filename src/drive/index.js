


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
      return gapi.load('client:auth2', () => {
        gapi.client.init({
          apiKey: kApiKey,
          clientId: kClientId,
          discoveryDocs: kDiscoveryDocs,
          scope: kScopes.join(' '),
          ux_mode: 'redirect',
          redirect_uri: window.location.href
        })
        .then(() => {
          auth().isSignedIn.listen(onSignInChanged);
          onSignInChanged();
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
      return {
        id: profile.getId(),
        name: profile.getName(),
        email: profile.getEmail()
      };
    } else {
      return null;
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

};


function auth() {
  return gapi.auth2.getAuthInstance();
}
