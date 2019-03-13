
<script>

import { VMenu, VIcon, VBtn, VList } from 'vuetify/lib'

export default {
  name: 'PopupMenu',

  components: {
    VMenu, VIcon, VBtn, VList
  }


}

</script>

<template>
  <v-menu bottom left nudge-left>
    <template v-slot:activator="{ on }">
      <v-btn
        icon
        v-on="on"
      >
        <v-icon>more_vert</v-icon>
      </v-btn>
    </template>
    <v-list dense>
      <slot />
    </v-list>
  </v-menu>
</template>

<style>

</style>

