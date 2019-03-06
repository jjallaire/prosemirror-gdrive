


<script>

import { VIcon, VListTile, VListTileAction, VListTileContent } from 'vuetify/lib'

export default {
  name: 'NavigationTile',

  components: {
    VIcon, VListTile, VListTileAction, VListTileContent
  },

  props: {
    path: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    caption: {
      type: String,
      required: true
    }
  }
}


</script>


<template>

  <v-list-tile :to="path ? {path: path} : null" exact @click="$emit('click', $event)">
    <v-list-tile-action v-if="icon">
      <v-icon>{{ icon }}</v-icon>
    </v-list-tile-action>
    <v-list-tile-content>
      <v-list-tile-title>{{ caption }}</v-list-tile-title>
    </v-list-tile-content>
  </v-list-tile>

</template>