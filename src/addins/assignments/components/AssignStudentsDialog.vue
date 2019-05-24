

<script>

import ModalDialog from '../../../components/core//ModalDialog.vue'
import { setTimeout } from 'timers';

export default {

  name: 'AssignStudentsDialog',

  components: {
    ModalDialog
  },

  data: function() {
    return {
      progress: 0
    }
  },

  computed: {
    progress_caption: function() {
      return "Assigning to jj.allaire@gmail.com...";
    }
  },

  methods: {

    show() {

      // reset progress
      this.progress = 0;

      // show the dialog 
      return this.$refs.dialog.show({
        ok: () => {
          
          return new Promise((resolve) => {
          
            this.progress = 30;

            this.$refs.dialog.disableActions();

            setTimeout(() => {
              resolve();
            }, 2000);
          })
        },
        cancel: null
      });
    },
  }
}

</script>

<template>
  <ModalDialog ref="dialog" caption="Assign to Students" ok_caption="Assign">
    <template slot="content">
      <v-layout row wrap>
        <v-flex xs12>
          <v-label>Email addresses:</v-label>
          <v-textarea solo autofocus full-width rows="15" />
          <v-label v-if="progress > 0">{{ progress_caption }}</v-label>
          <v-label v-else>&nbsp;</v-label>
          <v-progress-linear v-model="progress" class="assign-students-progress" :active="progress > 0" />
          
        </v-flex>
      </v-layout>
    </template>
  </ModalDialog>

</template>

<style>

.assign-students-progress {
  margin-top: 0.5rem;
  margin-bottom: 0;
}



</style>