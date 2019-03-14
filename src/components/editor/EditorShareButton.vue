<script>

import { VBtn, VIcon } from 'vuetify/lib'

import drive from '../../drive'

export default {
  name: 'EditorShareButton',

  components: {
    VBtn, VIcon
  },

  props: {
    doc_id: {
      type: String,
      required: true
    }
  },

  methods: {
    onShareClicked() {
      drive.shareFile(this.doc_id);
    },
  }
}

</script>

<template>

  <v-btn depressed small color="info" @click="onShareClicked">
    <v-icon small light>people</v-icon>
    &nbsp;
    Share
  </v-btn>

</template>

<style>

</style>
