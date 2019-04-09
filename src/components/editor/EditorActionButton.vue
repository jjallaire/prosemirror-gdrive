<script>

import { VBtn, VIcon } from 'vuetify/lib'

export default {
  name: 'EditorActionButton',

  components: {
    VBtn, VIcon
  },

  props: {
    icon: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: 'info'
    },
    doc_id: {
      type: String,
      required: true
    }
  },
}

</script>

<template>

  <v-btn depressed small :color="color" @click="$emit('clicked', doc_id)">
    <v-icon small light>{{ icon }}</v-icon>
    &nbsp;
    {{ caption }}
  </v-btn>

</template>

<style>

</style>
