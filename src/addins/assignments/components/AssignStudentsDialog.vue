

<script>

import ModalDialog from '../../../components/core//ModalDialog.vue'

export default {

  name: 'AssignStudentsDialog',

  components: {
    ModalDialog
  },

  data: function() {
    return {
     
    }
  },

  methods: {

    show() {

     

      // show the dialog 
      return this.$refs.dialog.show({
        ok: () => {},
        cancel: null
      });
    },
  }
}

</script>

<template>
  <ModalDialog ref="dialog" caption="Assign to Students">
    <template slot="content">
      <v-layout row wrap>
        <v-flex xs12>
          <v-subheader>Student email addresses:</v-subheader>
          <v-textarea solo autofocus full-width rows="12" />
        </v-flex>
      </v-layout>
    </template>
  </ModalDialog>

</template>

<style>


</style>