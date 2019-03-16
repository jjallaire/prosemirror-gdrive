
<script>

import { VApp, VNavigationDrawer, VToolbar, VContent, VContainer, 
         VSpacer, VBtn, VIcon } from 'vuetify/lib'

import { mapGetters } from 'vuex'

import AuthPage from './components/auth/AuthPage.vue'
import ErrorPanel from './components/core/ErrorPanel.vue'
import ProgressSpinner from './components/core/ProgressSpinner.vue'
import NavigationList from './components/navigation/NavigationList.vue'

import drive from './drive'

export default {

  name: 'App',

  components: {
    VApp, VNavigationDrawer, VToolbar, VContent, VContainer, VSpacer, VBtn, VIcon, 
    ProgressSpinner, NavigationList, AuthPage, ErrorPanel
  },

  data () {
    return {
      drawer: null
    }
  },

  computed: {
    ...mapGetters([
      'initialized',
      'init_error',
      'authorized',
      'user'
    ]),

  },

  methods: {
  
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

    <v-navigation-drawer v-if="authorized" v-model="drawer" temporary fixed app>
      <NavigationList />
    </v-navigation-drawer>
    
    <v-toolbar color="orange" dark fixed app dense :clipped-left="true" :height="45">
      <v-toolbar-side-icon @click.stop="drawer = !drawer" />
      <router-link to="/" class="toolbar-title">
        <v-toolbar-title>ProseMirror GDrive</v-toolbar-title>
      </router-link>
      <v-spacer />
      <template v-if="authorized">
        <span>{{ user.email }}</span>
        <v-btn title="Sign out" icon @click="onSignOutClicked">
          <v-icon>exit_to_app</v-icon>
        </v-btn>
        <v-btn title="Settings" :to="{ path: '/settings/' }" icon>
          <v-icon>settings</v-icon>
        </v-btn>
      </template>
      <template v-else-if="initialized">
        <v-btn flat @click="onSignInClicked">Sign In</v-btn>
      </template>
      
    </v-toolbar>
    <v-content>
      <v-container class="app-container" fluid fill-height>
        <ErrorPanel v-if="init_error" :error="init_error" />
        <ProgressSpinner v-else-if="!initialized" />
        <AuthPage v-else-if="!authorized" />
        <router-view v-else :key="$route.fullPath" />
      </v-container>
    </v-content>
  </v-app>
</template>


<style>

.app-container {
  padding: 8px;
}

.toolbar-title {
  color: inherit;
  text-decoration: inherit;
}

.v-navigation-drawer {
  padding-top: 0px;
}

.v-navigation-drawer.v-navigation-drawer--is-mobile {
  padding-top: 0px;
}

</style>
