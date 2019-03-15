<script>

import { VSnackbar, VBtn } from 'vuetify/lib'

export default {

  name: 'EditorSaveError',

  components: {
    VSnackbar, VBtn
  },

  props: {
    error: {
      type: String,
      default: null
    }
  },

  computed: {
    snackbar: function() {
      return this.error !== null;
    }
  },

  methods: {
    onCloseClicked() {
      this.$emit('close');
    }
  }
}

</script>

<template>

  <v-snackbar :value="snackbar" top :multi-line="true" @input="$emit('close')">
    {{ error }}
    <v-btn dark flat @click="$emit('close')">Close</v-btn>
  </v-snackbar>

</template>