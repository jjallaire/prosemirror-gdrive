
<script>

import { VApp, VNavigationDrawer, VToolbar, VContent, VContainer, 
         VSpacer, VBtn, VIcon,
         VList, VListTile, VListTileAction, VListTileContent } from 'vuetify/lib'

import { mapGetters } from 'vuex'

import AuthPage from './components/AuthPage.vue'
import LoadingPage from './components/LoadingPage.vue'

import { SET_INITIALIZED, SET_USER } from './store/mutations'

import drive from './drive'

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
    ...mapGetters([
      'initialized',
      'authorized',
      'user'
    ]),

  },

  mounted() {

    drive.connect(this.onSignInChanged)
      .then(() => {
         this.$store.commit(SET_INITIALIZED, true);
         this.onSignInChanged();
      })
      .catch(error => {
        window.alert(error.message);
      });
  },

  methods: {
  
    onSignInChanged() {
      this.$store.commit(SET_USER, drive.signedInUser());
    },

    onSignInClicked() {
      drive.signIn();
    },

    onSignOutClicked() {
      drive.signOut();
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
