

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
      show_recent: true
    }
  },

  computed: {
    ...mapGetters([
      'recent_docs'
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
      v-if="recent_docs.length > 0"
      v-model="show_recent"
      class="recent-documents"
      no-action=""
    >
      <template v-slot:activator>
        <NavigationTile icon="history" caption="Recent Documents" />
      </template>

      <NavigationTile v-for="file in recent_docs.slice(0,8)" :key="file.id"
                      :caption="file.name" :path="'/edit/' + file.id" 
      />
    
    </v-list-group>
    <v-divider v-else />

    <NavigationTile path="/settings/" icon="settings" caption="Settings" />
  
    <v-divider />

  </v-list>

</template>


<style>

.recent-documents .v-list__group__items .v-list__tile--link {
  font-weight: 400 !important;
}



</style>
