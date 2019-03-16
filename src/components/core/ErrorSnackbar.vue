<script>

import { VSnackbar, VBtn } from 'vuetify/lib'

import { mapGetters } from 'vuex'

import { SET_SNACKBAR_ERROR } from '../../store/mutations'

export default {

  name: 'ErrorSnackbar',

  components: {
    VSnackbar, VBtn
  },

  computed: {
    ...mapGetters([
      'snackbar_error'
    ]),
    snackbar: function() {
      return this.snackbar_error !== null;
    }
  },

  methods: {
    onClosed() {
      this.$store.commit(SET_SNACKBAR_ERROR, null);
    }
  }
}

</script>

<template>

  <v-snackbar :value="snackbar" top :multi-line="true" @input="onClosed">
    {{ snackbar_error }}
    <v-btn dark flat @click="onClosed">Close</v-btn>
  </v-snackbar>

</template>