


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
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    caption: {
      type: String,
      required: true
    }
  }
}


</script>


<template>

  <v-list-tile :to="{path: path}">
    <v-list-tile-action>
      <v-icon>{{ icon }}</v-icon>
    </v-list-tile-action>
    <v-list-tile-content>
      <v-list-tile-title>{{ caption }}</v-list-tile-title>
    </v-list-tile-content>
  </v-list-tile>

</template>