
<script>

import _debounce from 'lodash/debounce'

import { VApp, VNavigationDrawer, VToolbar, VContent, VContainer, 
         VSpacer, VBtn, VIcon } from 'vuetify/lib'

import { mapGetters } from 'vuex'

import AuthPage from './components/auth/AuthPage.vue'
import ErrorPanel from './components/core/ErrorPanel.vue'
import ErrorSnackbar from './components/core/ErrorSnackbar.vue'
import ProgressSpinner from './components/core/ProgressSpinner.vue'
import NavigationList from './components/navigation/NavigationList.vue'
import EditorDocTitle from './components/editor/EditorDocTitle.vue'

import dialog from './components/core/dialog'
import drive from './drive'
import config from './config'
import { isTeacher } from './store/selectors'

import { docInfo } from './store/state'
import { SET_DOC } from './store/mutations'


export default {

  name: 'App',

  components: {
    VApp, VNavigationDrawer, VToolbar, VContent, VContainer, VSpacer, VBtn, VIcon, 
    ProgressSpinner, NavigationList, AuthPage, ErrorPanel, ErrorSnackbar, EditorDocTitle
  },

  data () {
    return {
      drawer: null
    }
  },

  computed: {
    title: function() {
      return config.app.title;
    },
    ...mapGetters([
      'initialized',
      'init_error',
      'authorized',
      'user',
      'doc',
      'page_title',
      'page_subtitle'
    ]),

    is_teacher: function() {
      return this.authorized && isTeacher(this.user);
    }
  },



  methods: {
  
    onSignInClicked() {
      drive.signIn();
    },

    onSignOutClicked() {
      drive.signOut();
    },

    onTitleChanged: _debounce(function(value) {
      drive
        .renameFile(this.doc.id, value)
        .then(result => {
          this.$store.commit(
            SET_DOC,
            docInfo(this.doc.id, value, result.headRevisionId, this.doc.properties)
          );
        })
        .catch(error => {
          dialog.error("Drive Error", error.message);
        });
    }, 1000),
  }

}

</script>


<template>
  <v-app>

    <v-navigation-drawer v-if="is_teacher" v-model="drawer" temporary fixed app>
      <NavigationList />
    </v-navigation-drawer>
    
    <v-toolbar color="orange" dark fixed app dense :clipped-left="true" :height="45">
      <v-toolbar-side-icon v-if="is_teacher" @click.stop="drawer = !drawer" />
      <v-btn v-else-if="initialized" title="Home" :to="{ path: '/' }" icon>
        <v-icon>home</v-icon>
      </v-btn>
      <v-toolbar-title v-if="page_title" class="toolbar-title">
        {{ page_title }}
      </v-toolbar-title>
      <v-toolbar-title v-else-if="doc.title" class="toolbar-title">
        <EditorDocTitle :value="doc.title" @input="onTitleChanged" />
      </v-toolbar-title>
      <span v-if="page_subtitle">&nbsp;&mdash;&nbsp;{{ page_subtitle }}</span>
      <v-spacer />
      <template v-if="authorized">
        <span>{{ user.email }}</span>
        <v-btn title="Sign out" icon @click="onSignOutClicked">
          <v-icon>exit_to_app</v-icon>
        </v-btn>
      </template>
      <template v-else-if="initialized">
        <v-btn flat @click="onSignInClicked">Sign In</v-btn>
      </template>
      
    </v-toolbar>
    <v-content>
      <v-container class="app-container">
        <ErrorPanel v-if="init_error" :error="init_error" />
        <ProgressSpinner v-else-if="!initialized" />
        <AuthPage v-else-if="!authorized" />
        <router-view v-else :key="$route.fullPath" />
      </v-container>
    </v-content>

    <ErrorSnackbar />

  </v-app>
</template>


<style>

.app-container {
  position: fixed;
  top: 52px;
  bottom: 8px;
  right: 8px;
  left: 8px;
  padding: 0;
  margin: 0;
  max-width: initial;
  width: initial;
}

.toolbar-title {
  color: inherit;
  text-decoration: inherit;
  margin-left: 0 !important;
}

.v-navigation-drawer {
  padding-top: 0px;
}

.v-navigation-drawer.v-navigation-drawer--is-mobile {
  padding-top: 0px;
}

</style>
