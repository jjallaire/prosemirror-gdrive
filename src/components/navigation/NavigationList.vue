

<script>


import { VListGroup, VDivider, VList } from 'vuetify/lib'

import NavigationTile from './NavigationTile.vue'

import { addinNavigationGroups } from '../../addins'

import { newDocument, openDocument } from '../core/docs'

import { mapGetters } from 'vuex'

export default {

  name: 'NavigationList',

  components: {
    VListGroup, VDivider, VList, NavigationTile
  },

  data () {
    return {
      show_recent: true,
      navigation_groups: addinNavigationGroups()
    }
  },

  computed: {
    ...mapGetters([
      'recent_docs'
    ])
  },

  methods: {

    onNewDocumentClicked() {
      newDocument();
    },

    onOpenDocumentClicked() {
      openDocument();
    }
  }

}

</script>

<template>

  <v-list dense>

    <NavigationTile path="/" icon="home" caption="Home" />

    <v-divider />

    <NavigationTile icon="add" caption="New Document" @click="onNewDocumentClicked" />
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

    <template v-for="group in navigation_groups">
      
      <v-list-group
        :key="group.caption"
        :value="group.expanded"
        no-action=""
      >
        <template v-slot:activator>
          <NavigationTile :icon="group.icon" :caption="group.caption" />
        </template>
        
        <NavigationTile v-for="item in group.items" :key="item.path" :caption="item.caption" :path="item.path" />    
      
      </v-list-group>

      <v-divider :key="group.caption + 'divider'" />

    </template>

    <NavigationTile path="/settings/" icon="settings" caption="Settings" />
  
    <v-divider />

  </v-list>

</template>


<style>

.recent-documents .v-list__group__items .v-list__tile--link {
  font-weight: 400 !important;
}



</style>
