

<script>

import ErrorPanel from '../core/ErrorPanel.vue'
import ProgressSpinner from '../core/ProgressSpinner.vue'
import { VContainer, VLayout, VFlex, VSubheader, VSelect, VCard, VCardTitle } from 'vuetify/lib'

import { UPDATE_SETTINGS } from '../../store/mutations'

import drive from '../../drive'
import { syncSettings } from '../../drive/settings'

export default {
  name: 'SettingsPage',

  components: {
     ErrorPanel, ProgressSpinner, VContainer, VLayout, VFlex, VSubheader, VSelect, VCard, VCardTitle
  },

  data: function() {
    return {
      error: null,
      initialized: false
    }
  },

  computed: {
    recent_documents: {
      get () {
        return this.$store.getters.settings.recent_documents;
      },
      set (value) {
        this.update_settings('recent_documents', value);
        drive.updateRecentDocs();
      }
    },

  },

  mounted() {
    syncSettings()
      .then(() => {
        this.initialized = true;
      })
      .catch(error => {
        this.error = error;
      });
  },
  
  methods: {
    update_settings: function(name, value) {
      this.$store.commit(UPDATE_SETTINGS, {
        ...this.$store.getters.settings,
        [name]: value
      });
    }
  }
}

</script>


<template>

  
  <div class="settings-container">
    <div v-if="error">
      <ErrorPanel :error="error" />
    </div>
    <div v-else-if="initialized">
      <v-card class="settings-card">
        <v-card-title><h2>Settings</h2></v-card-title>
        <v-container fluid>
          <v-layout row wrap align-center>
            <v-flex xs6>
              <v-subheader>Recent documents:</v-subheader>
            </v-flex>
            <v-flex xs6>
              <v-select
                v-model="recent_documents"
                :items="[5, 8, 10, 15]"
                solo
              />
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </div>
    <div v-else>
      <ProgressSpinner />
    </div>

  </div>

</template>

<style>
.settings-container {
  width: 100%;
  height: 100%;
}

.settings-card {
  height: calc(100vh - 65px);
}
</style>
