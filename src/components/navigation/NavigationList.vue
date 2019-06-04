

<script>


import { VListGroup, VDivider, VList } from 'vuetify/lib'

import NavigationTile from './NavigationTile.vue'

import { addinNavigation } from '../../addins'

export default {

  name: 'NavigationList',

  components: {
    VListGroup, VDivider, VList, NavigationTile
  },

  data () {
    return {
      navigation: addinNavigation()
    }
  },

  computed: {
   
  },

  methods: {

  }

}

</script>

<template>

  <v-list dense>

    <NavigationTile path="/" icon="alarm" caption="Assignments" />

    <v-divider />

    <template v-for="item in navigation.items">
      <NavigationTile :key="item.path" :icon="item.icon" :caption="item.caption" :path="item.path" /> 
    </template>

    <v-divider v-if="navigation.items.length > 0" />

    <template v-for="group in navigation.groups">
      
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
  
    <v-divider />

  </v-list>

</template>


<style>

.recent-documents .v-list__group__items .v-list__tile--link {
  font-weight: 400 !important;
}



</style>
