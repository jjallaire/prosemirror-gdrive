

<script>

import ModalDialog from '../../../components/core//ModalDialog.vue'

import drive from '../../../drive'

import { Status, createStudentAssignment, studentAssignments, setStudentAssignmentStatus } from '../assignment'


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

    show(doc_id, teacher) {

      // reset state
      this.clearProgress();
      this.students_text = '';

      // show the dialog 
      return this.$refs.dialog.show({
        ok: () => this.assignStudents(doc_id, teacher),
        cancel: null
      });
    },

    assignStudents(doc_id, teacher) {  
      this.progress = 20;
      this.progress_caption = "Accessing assignment...";
      let student_assignments = [];
      
      function existingAssignment(student) {
        for (let i=0; i<student_assignments.length; i++) {
          let assignment = student_assignments[i];
          if (assignment.student === student)
            return assignment;
        }
        return null;
      }
    

      return studentAssignments(doc_id)
        .then(assignments => {
          student_assignments = assignments;
          return drive.getFile(doc_id);
        })
        .then(assignment => {
          let result = this.students.reduce( (previousPromise, nextStudent, idx) => {
            return previousPromise.then(() => {
                
              this.progress = 20 + (idx / this.students.length) * 80;
              this.progress_caption = `Assigning to ${nextStudent}...`;

              // check assignment status
              let existing = existingAssignment(nextStudent);
              if (existing !== null) {
                if (existing.status === Status.Unassigned)
                  return setStudentAssignmentStatus(existing.id, Status.StudentDraft);
                else
                  return Promise.resolve();
              } else {
                return this.assignStudent(assignment, nextStudent, teacher);
              }
            });
          }, Promise.resolve());
          return result;
        });
    },



    assignStudent(assignment, student, teacher) {
      return createStudentAssignment(
        assignment.metadata.id, 
        assignment.metadata.name, 
        student,
        teacher
      );
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