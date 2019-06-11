

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
      enter_grade: false,
      grade: null,
      progress: false
    }
  },

  methods: {

    show(doc_id, status, caption, text, enter_grade = false, grade = null) {

      // reset state
      this.caption = caption;
      this.text = text;
      this.enter_grade = enter_grade;
      this.grade = grade,
      this.progress = false;

      // show the dialog 
      return this.$refs.dialog.show({
        ok: () => {
          // show progress
          this.progress = true;

          // perform action 
          let grade = this.grade;
          return this.$store.dispatch(SET_DOC_STATUS, { status, grade })
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
  <ModalDialog ref="dialog" :caption="caption">
    <template slot="content">
      <v-layout row wrap>
        <v-flex xs12>
          
          <v-text-field v-if="enter_grade" v-model="grade" :label="text" solo autofocus />
          <span v-else>{{ text }}</span>

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