

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
      default: null
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

  <v-list-tile class="menu-tile" avatar @click="clicked">
    <v-list-tile-avatar class="menu-avatar" :size="30"> <v-icon>{{ icon }}</v-icon></v-list-tile-avatar>
    <v-list-tile-title>{{ text }}</v-list-tile-title>
  </v-list-tile>

</template>

<style>

.menu-avatar {
  min-width: 35px;
}

.menu-tile .v-list__tile__title {
  padding-right: 20px;
}



</style>