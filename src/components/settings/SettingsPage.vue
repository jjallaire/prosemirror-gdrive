

<script>

import ErrorPanel from '../core/ErrorPanel.vue'
import ProgressSpinner from '../core/ProgressSpinner.vue'
import { VContainer, VLayout, VFlex, VSubheader, VSelect, VCard } from 'vuetify/lib'

import { UPDATE_SETTINGS, SET_PAGE_TITLE } from '../../store/mutations'

import { syncSettings } from '../../drive/settings'

export default {
  name: 'SettingsPage',

  components: {
     ErrorPanel, ProgressSpinner, VContainer, VLayout, VFlex, VSubheader, VSelect, VCard
  },

  data: function() {
    return {
      error: null,
      initialized: false
    }
  },

  computed: {
    my_setting: {
      get () {
        return this.$store.getters.settings.my_setting;
      },
      set (value) {
        this.update_settings('my_setting', value);
      }
    },

  },

  mounted() {
    this.$store.commit(SET_PAGE_TITLE, "Settings");
    syncSettings()
      .then(() => {
        this.initialized = true;
      })
      .catch(error => {
        this.error = error;
      });
  },

  beforeDestroy() {
    this.$store.commit(SET_PAGE_TITLE, null);
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
        <v-container fluid>
          <v-layout row wrap align-center>
            <v-flex xs6>
              <v-subheader>My setting:</v-subheader>
            </v-flex>
            <v-flex xs6>
              <v-select
                v-model="my_setting"
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
