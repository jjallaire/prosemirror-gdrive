

<script>

import ModalDialog from '../../../components/core//ModalDialog.vue'

import { assignToStudent } from '../drive'

export default {

  name: 'AssignStudentsDialog',

  components: {
    ModalDialog
  },

  data: function() {
    return {
      progress: 0,
      progress_caption: '',
      students_text: ''
    }
  },

  computed: {

    students: function() {
      let students = [];
      let lines = this.students_text.split(/\n/);
      for (let i=0; i<lines.length; i++) {
        let line = lines[i];
        if (/\S/.test(line))
          students.push(line.trim());
      }
      return students;
    },
  },

  methods: {

    show(doc_id) {

      // reset state
      this.clearProgress();
      this.students_text = '';

      // show the dialog 
      return this.$refs.dialog.show({
        ok: () => this.assignStudents(doc_id),
        cancel: null
      });
    },

    assignStudents(doc_id) {   
      return this.students.reduce( (previousPromise, nextStudent, idx) => {
        return previousPromise.then(() => {
          return this.assignStudent(doc_id, nextStudent, idx);
        });
      }, Promise.resolve());
    },

    assignStudent(doc_id, student, idx) {
      return new Promise(resolve => {
        this.progress = Math.max((idx / this.students.length) * 100, 10);
        this.progress_caption = `Assigning to ${student}...`;
        assignToStudent(doc_id, student).then(resolve);
      });
    },

    clearProgress() {
      this.progress = 0;
      this.progress_caption = '';
    }

  }
}

</script>

<template>
  <ModalDialog ref="dialog" caption="Assign to Students" ok_caption="Assign">
    <template slot="content">
      <v-layout row wrap>
        <v-flex xs12>
          <v-label>Email addresses:</v-label>
          <v-textarea v-model="students_text" solo autofocus full-width rows="15" />
          <v-label v-if="progress_caption">{{ progress_caption }}</v-label>
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