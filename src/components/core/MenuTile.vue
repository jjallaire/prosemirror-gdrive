

<script>


import { VListTile, VListTileAvatar, VListTileTitle, VIcon } from 'vuetify/lib'

export default {

  name: 'MenuTile',

  components: {
    VListTile, VListTileAvatar, VListTileTitle, VIcon 
  },

  props: {
    icon: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  },

  methods: {
    clicked() {
      this.$emit('clicked');
    }
  }

}

</script>


<template>

  <v-list-tile avatar @click="clicked">
    <v-list-tile-avatar> <v-icon>{{ icon }}</v-icon></v-list-tile-avatar>
    <v-list-tile-title>{{ text }}</v-list-tile-title>
  </v-list-tile>

</template>