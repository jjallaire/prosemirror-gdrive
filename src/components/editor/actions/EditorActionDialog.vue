

<script>

import ModalDialog from '../../core/ModalDialog.vue'

import { SET_DOC_STATUS } from '../../../store/actions.js'


export default {

  name: 'EditorActionDialog',

  components: {
    ModalDialog
  },

  data: function() {
    return {
      caption: '',
      text: '',
      ok_caption: 'OK',
      progress: false
    }
  },

  methods: {

    show(doc_id, status, caption, text, ok_caption = 'OK') {

      // reset state
      this.caption = caption;
      this.text = text;
      this.ok_caption = ok_caption;
      this.progress = false;

      // show the dialog 
      return this.$refs.dialog.show({
        ok: () => {
          // show progress
          this.progress = true;

          // perform action 
          return this.$store.dispatch(SET_DOC_STATUS, status)
            .then(() => {
              this.progress = false;
            })
        },
        cancel: null
      });
    },
  }
}

</script>

<template>
  <ModalDialog ref="dialog" :caption="caption" :ok_caption="ok_caption">
    <template slot="content">
      <v-layout row wrap>
        <v-flex xs12>
          {{ text }}
          <v-progress-linear :indeterminate="true" class="action-progress" :active="progress" />
        </v-flex>
      </v-layout>
    </template>
  </ModalDialog>

</template>

<style>

.action-progress {
  margin-top: 0.5rem;
  margin-bottom: 0;
}



</style>