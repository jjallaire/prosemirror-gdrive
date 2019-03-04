
<script>

import { VApp, VNavigationDrawer, VToolbar, VContent, VContainer, 
         VSpacer, VBtn, VIcon, VDivider, VList } from 'vuetify/lib'

import { mapGetters } from 'vuex'

import AuthPage from './components/auth/AuthPage.vue'
import ProgressSpinner from './components/core/ProgressSpinner.vue'
import NavigationTile from './components/core/NavigationTile.vue'

import { SET_INITIALIZED, SET_USER } from './store/mutations'

import drive from './drive'

export default {
  name: 'App',

  components: {
    VApp, VNavigationDrawer, VToolbar, VContent, VContainer, 
    VSpacer, VBtn, VIcon, VDivider, VList, 
    ProgressSpinner, NavigationTile,
    AuthPage
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
      drive.signedInUser()
        .then(user => {
          this.$store.commit(SET_USER, user);
        })
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
      v-if="authorized"
      v-model="drawer"
      fixed
      app
    >
      <v-list dense>

        <NavigationTile path="/" icon="home" caption="Home" />

        <v-divider />

        <NavigationTile path="/settings/" icon="settings" caption="Settings" />
        <NavigationTile path="/help" icon="help" caption="Help" />

        <v-divider />
    
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="orange" dark fixed app dense :clipped-left="true">
      <v-toolbar-side-icon @click.stop="drawer = !drawer" />
      <router-link to="/" class="toolbar-title">
        <v-toolbar-title>ProseMirror GDrive</v-toolbar-title>
      </router-link>
      <v-spacer />
      <template v-if="authorized">
        <span>{{ user.email }}</span>
        <v-btn icon @click="onSignOutClicked">
          <v-icon>exit_to_app</v-icon>
        </v-btn>
        <v-btn :to="{ path: '/settings/' }" icon>
          <v-icon>settings</v-icon>
        </v-btn>
      </template>
      <template v-else-if="initialized">
        <v-btn flat @click="onSignInClicked">Sign In</v-btn>
      </template>
      
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <ProgressSpinner v-if="!initialized" />
        <AuthPage v-else-if="!authorized" />
        <router-view v-else />
      </v-container>
    </v-content>
  </v-app>
</template>


<style>

.toolbar-title {
  color: inherit;
  text-decoration: inherit;
}

.v-navigation-drawer {
  padding-top: 55px;
}

.v-navigation-drawer.v-navigation-drawer--is-mobile {
  padding-top: 0px;
}

</style>
