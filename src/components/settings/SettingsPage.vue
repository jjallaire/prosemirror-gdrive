

<script>

import { VContainer, VLayout, VFlex, VSubheader, VSelect } from 'vuetify/lib'

export default {
  name: 'SettingsPage',

  components: {
     VContainer, VLayout, VFlex, VSubheader, VSelect
  },

  data: function() {
    return {
      recent_docs: 100
    }
  },
  
  methods: {

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
            v-model="recent_docs"
            :items="[25,50,100,500,1000]"
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
