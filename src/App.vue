
<script>

import { VApp, VNavigationDrawer, VToolbar, VContent, VContainer, 
         VSpacer, VBtn, VIcon,
         VList, VListTile, VListTileAction, VListTileContent } from 'vuetify/lib'

import { mapState } from 'vuex'

import AuthPage from './components/AuthPage.vue'
import LoadingPage from './components/LoadingPage.vue'

import { SET_INITIALIZED, SET_USER, CLEAR_USER } from './store'

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
  name: 'App',

  components: {
    VApp, VNavigationDrawer, VToolbar, VContent, VContainer, 
    VSpacer, VBtn, VIcon,
    VList, VListTile, VListTileAction, VListTileContent,
    LoadingPage, AuthPage
  },

  data () {
    return {
      drawer: false
    }
  },

  computed: {
    ...mapState([
      'initialized',
      'user'
    ]),

    authorized() {
      return this.user.id !== null;
    },

  },

  mounted() {
    gapi.load('client:auth2', () => {
       
      gapi.client.init({
        apiKey: kApiKey,
        clientId: kClientId,
        discoveryDocs: kDiscoveryDocs,
        scope: kScopes.join(' '),
        ux_mode: 'redirect',
        redirect_uri: window.location.href
      }).then(() => {
        
        this.$store.commit(SET_INITIALIZED, true);
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

    updateSigninStatus(isSignedIn) {
      if (isSignedIn) {
        let user = this.auth().currentUser.get();
        let profile = user.getBasicProfile();
        this.$store.commit(SET_USER, {
          id: profile.getId(),
          name: profile.getName(),
          email: profile.getEmail()
        });
      } else {
        this.$store.commit(CLEAR_USER);
      }
    },

    onSignInClicked() {
      this.auth().signIn();
    },

    onSignOutClicked() {
      this.auth().signOut();
    },
  }

}

</script>


<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      app
    >
      <v-list v-if="authorized" dense>
        <v-list-tile @click.stop="">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click.stop="">
          <v-list-tile-action>
            <v-icon>contact_mail</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Contact</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="orange" dark fixed app :clipped-left="true">
      <v-toolbar-side-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>ProseMirror GDrive</v-toolbar-title>
      <v-spacer />
      <template v-if="authorized">
        <span>{{ user.email }}</span>
        <v-btn icon @click="onSignOutClicked">
          <v-icon>exit_to_app</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>settings</v-icon>
        </v-btn>
      </template>
      <template v-else-if="initialized">
        <v-btn flat @click="onSignInClicked">Sign In</v-btn>
      </template>
      
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <LoadingPage v-if="!initialized" />
        <AuthPage v-else-if="!authorized" />
        <router-view v-else />
      </v-container>
    </v-content>
  </v-app>
</template>


<style>

.v-navigation-drawer {
  padding-top: 70px;
}

.v-navigation-drawer.v-navigation-drawer--is-mobile {
  padding-top: 0px;
}

</style>
