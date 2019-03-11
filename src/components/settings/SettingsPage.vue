

<script>

import ErrorDisplay from '../core/ErrorDisplay.vue'
import ProgressSpinner from '../core/ProgressSpinner.vue'
import { VContainer, VLayout, VFlex, VSubheader, VSelect } from 'vuetify/lib'

import { UPDATE_SETTINGS } from '../../store/mutations'

import { syncSettings } from '../../drive/settings'

export default {
  name: 'SettingsPage',

  components: {
     ErrorDisplay, ProgressSpinner, VContainer, VLayout, VFlex, VSubheader, VSelect
  },

  data: function() {
    return {
      error: null,
      initialized: false
    }
  },

  computed: {
    document_history: {
      get () {
        return this.$store.getters.settings.document_history;
      },
      set (value) {
        this.update_settings('document_history', value);
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
      <ErrorDisplay :error="error" />
    </div>
    <div v-else-if="initialized">
      <h1>Settings</h1>
      <v-container fluid>
        <v-layout row wrap align-center>
          <v-flex xs6>
            <v-subheader>Maximum documents in history:</v-subheader>
          </v-flex>
          <v-flex xs6>
            <v-select
              v-model="document_history"
              :items="[1,3,5,10,50]"
              solo
            />
          </v-flex>
        </v-layout>
      </v-container>
    </div>
    <div v-else>
      <ProgressSpinner />
    </div>

  </div>

</template>

<style>
.settings-container {
  width: 100%;
}
</style>
