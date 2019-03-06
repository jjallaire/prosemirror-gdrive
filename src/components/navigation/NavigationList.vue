

<script>

import { VListGroup, VDivider, VList } from 'vuetify/lib'

import NavigationTile from './NavigationTile.vue'

import drive from '../../drive'

import { mapGetters } from 'vuex'

export default {

  name: 'NavigationList',

  components: {
    VListGroup, VDivider, VList, NavigationTile
  },

  data () {
    return {
      show_recent: false
    }
  },

  computed: {
    ...mapGetters([
      'recent_files'
    ])
  },

  methods: {
    onOpenDocumentClicked() {
      drive.openFile()
        .then(doc => {
          this.$router.push({ path: "/edit/" + doc.id });
        });
    }
  }

}

</script>

<template>

  <v-list dense>

    <NavigationTile path="/" icon="home" caption="Home" />

    <v-divider />

    <NavigationTile path="/edit/" icon="add" caption="New Document" />
    <NavigationTile icon="folder_open" caption="Open Document" @click="onOpenDocumentClicked" />

    <v-list-group
      v-model="show_recent"
      no-action=""
    >
      <template v-slot:activator>
        <NavigationTile icon="history" caption="Recent Documents" />
      </template>

      <NavigationTile v-for="file in recent_files.slice(0,5)" :key="file.id"
                      :caption="file.name" :path="'/edit/' + file.id" 
      />
    
    </v-list-group>

    <NavigationTile path="/settings/" icon="settings" caption="Settings" />
    <NavigationTile path="/help" icon="help" caption="Help" />

    <v-divider />

  </v-list>

</template>


<style>




</style>
