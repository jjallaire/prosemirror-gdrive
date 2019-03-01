

<script>

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
  name: 'HomePage',

  data: function() {
    return {
      initialized: false,
      authorized: false,
      files: []
    }
  },

  mounted() {


     gapi.load('client:auth2', () => {
       
      gapi.client.init({
        apiKey: kApiKey,
        clientId: kClientId,
        discoveryDocs: kDiscoveryDocs,
        scope: kScopes.join(' ')
      }).then(() => {
        
        this.initialized = true;

        this.auth().isSignedIn.listen(this.updateSigninStatus);

        this.updateSigninStatus(this.auth().isSignedIn.get());

      }, error => {
        window.alert(error.message);
      });
    });

    
  },

  methods: {

    auth() {
      return gapi.auth2.getAuthInstance();
    },

    onAuthorizeClicked() {
      this.auth().signIn();
    },

    onSignOutClicked() {
      this.auth().signOut();
    },

    updateSigninStatus(isSignedIn) {
      this.authorized = isSignedIn;

      this.files = [];

      if (this.authorized) {
        gapi.client.drive.files.list({
          pageSize: 10,
          fields: 'nextPageToken, files(id, name)'
        }).then(response => {
          if (response.result.files)
            this.files = response.result.files;
        });
      }

    }

  }

}

</script>


<template>

  <div>
    <div v-if="initialized">
      <button v-if="!authorized" @click="onAuthorizeClicked">Authorize</button>
      <button v-else @click="onSignOutClicked">Sign Out</button>
    </div>
    <div v-else>
      Initializing....
    </div>

    <div v-for="file in files" :key="file.id">
      {{ file.name }} - {{ file.id }}
    </div>

  </div>

</template>