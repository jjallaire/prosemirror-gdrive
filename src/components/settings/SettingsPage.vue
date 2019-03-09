

<script>

import { VContainer, VLayout, VFlex, VSubheader, VSelect } from 'vuetify/lib'

import { UPDATE_SETTINGS } from '../../store/mutations'

export default {
  name: 'SettingsPage',

  components: {
     VContainer, VLayout, VFlex, VSubheader, VSelect
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

</template>

<style>
.settings-container {
    width: 100%;
}
</style>
