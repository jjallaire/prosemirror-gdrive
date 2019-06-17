
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

import EditorSubmitDraftButton from './components/editor/actions/EditorSubmitDraftButton.vue'
import EditorReturnDraftButton from './components/editor/actions/EditorReturnDraftButton.vue'
import EditorSubmitFinalDraftButton from './components/editor/actions/EditorSubmitFinalDraftButton.vue'
import EditorAssignGradeButton from './components/editor/actions/EditorAssignGradeButton.vue'


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
    ProgressSpinner, NavigationList, AuthPage, ErrorPanel, ErrorSnackbar, EditorDocTitle,
    EditorSubmitDraftButton, EditorReturnDraftButton, 
    EditorSubmitFinalDraftButton, EditorAssignGradeButton
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
      'page_title_link',
      'page_subtitle',
      'action_button',
      'status_message'
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
      return false;
    },

    onTitleChanged: _debounce(function(value) {
      drive
        .renameFile(this.doc.id, value)
        .then(result => {
          this.$store.commit(
            SET_DOC,
            docInfo(this.doc.id, value, result.headRevisionId, this.doc.properties, this.doc.description)
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
    
    <v-toolbar class="app-toolbar" color="orange" dark fixed app dense :clipped-left="true" :height="45">
      <v-toolbar-side-icon v-if="is_teacher" @click.stop="drawer = !drawer" />
      <v-btn v-else-if="initialized" title="Home" :to="{ path: '/' }" icon>
        <v-icon>home</v-icon>
      </v-btn>
      <v-toolbar-title v-if="page_title" class="toolbar-title">
        <a v-if="page_title_link" class="page-title-link" :href="page_title_link">{{ page_title }}</a>
        <span v-else>{{ page_title }}</span>
      </v-toolbar-title>
      <v-toolbar-title v-else-if="doc.title" class="toolbar-title">
        <EditorDocTitle :value="doc.title" @input="onTitleChanged" />
      </v-toolbar-title>
      <span v-if="page_subtitle">&nbsp;&nbsp;&nbsp;&nbsp;{{ page_subtitle }}</span>

      <v-chip v-if="status_message" class="status-message" color="white" disabled label outline>{{ status_message }}</v-chip>


      <EditorSubmitDraftButton v-if="action_button === 'submit-draft'" />
      <EditorReturnDraftButton v-else-if="action_button === 'return-draft'" />
      <EditorSubmitFinalDraftButton v-else-if="action_button === 'submit-final-draft'" />
      <EditorAssignGradeButton v-else-if="action_button === 'assign-grade'" />

      <v-spacer />
    
      <template v-if="authorized">
        <v-menu bottom offset-y open-on-click>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
              <v-avatar size="28px">
                <img :src="user.image">
              </v-avatar>
            </v-btn>
          </template>  
          <v-card>
            <v-card-text>
              <p>
                {{ user.name }}<br>
                {{ user.email }}
              </p>
              <a title="Sign out" icon @click="onSignOutClicked">
                Sign out
              </a>
            </v-card-text>
          </v-card>
        </v-menu>
       
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

.app-toolbar .v-toolbar__content {
  padding-right: 5px;
}

.app-toolbar .status-message {
  height: 28px;
  font-size: 14px;
  font-weight: 500;
  margin-left: 20px;
}

.app-toolbar .v-chip.v-chip.v-chip--outline,
.app-toolbar .v-chip__content {
  height: 28px;
}

.app-toolbar .editor-action-button {
  margin-left: 20px;
}

.sign-out-button {
  margin-left: 20px;
}

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

.page-title-link {
  text-decoration: none;
  color: inherit;
}

.page-title-link:hover {
  color: rgba(255,255,255,0.8);
}

.v-navigation-drawer {
  padding-top: 0px;
}

.v-navigation-drawer.v-navigation-drawer--is-mobile {
  padding-top: 0px;
}

</style>
