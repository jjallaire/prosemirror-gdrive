


<script>

import AppPage from '../../../components/core/AppPage.vue'

import EditorComponent from '../../../components/editor/EditorComponent.vue'

import drive from '../../../drive'
import DriveSave from '../../../drive/save'

import dialog from '../../../components/core/dialog'

import { docInfo } from '../../../store/state'
import { SET_DOC } from '../../../store/mutations'

import AssignStudentsDialog from './AssignStudentsDialog.vue'

import { mapGetters } from 'vuex'


export default {

  name: 'AssignmentPage',

  components: {
    AppPage, EditorComponent, AssignStudentsDialog
  },

  props: {
    doc_id: {
      type: String,
      required: true
    }
  },

  data: function() {
    return {

      driveSave: null,

      save_status: "clean",

      students: {
        headers: [
          {
            text: 'Student',
            value: 'student'
          },
          {
            text: 'Status',
            value: 'status'
          }

        ],
        items: [
          {
            foo: 1,
            bar: 2
          },
          {
            foo: 3,
            bar: 4
          },
        ],
        pagination: {
          sortBy: 'bar',
          descending: true,
        }
      }
    }
  },

  computed: {
    ...mapGetters([
      'user',
    ]),
  },

  mounted() {

    this.$refs.page.initialize(
      drive.getFile(this.doc_id)
        .then(file => {
          
          // set doc info
          this.$store.commit(
            SET_DOC, 
            docInfo(this.doc_id, file.metadata.name, file.metadata.headRevisionId, file.metadata.properties)
          );
      
          // monitor and save editor changes (triggered by onUpdate hook installed below)
          this.driveSave = new DriveSave(
            this.doc_id,
            this.onSaveStatus,
            null,
            this.onSaveError,
            "application/vnd.google.drive.ext-type.pmasn"
          );
        
          // initialize editor
          this.$refs.editor.initialize({
            content: JSON.parse(file.content).document,
            onUpdate: this.onEditorUpdate,
            autoFocus: true
          });
        })
    );
  },

  beforeDestroy() {
    this.$store.commit(SET_DOC, docInfo());
  },

  methods: {
    
    onEditorUpdate(update) {
      this.driveSave.onEditorUpdate(update);
    },

    onSaveStatus(status) {
      this.save_status = status;
    },

    onSaveError(error) {
      dialog.errorSnackbar(
        "Unable to save changes (" + error.message + "). " +
        "Please ensure you are online so that you don't lose work."
      );
    },

    onAssignStudents() {
      this.$refs.assignStudentsDialog.show(this.doc_id, this.user.name);
    }
  }

}

</script>

<template>

  <AppPage ref="page" class="assignment-page">

    <v-card>
      <v-card-text>
        <v-layout>
          <v-flex sm5>
            <v-subheader>Assignment description:</v-subheader>
            <EditorComponent ref="editor" class="assignment-editor" :minimal_toolbar="true" :save_status="save_status" />
          </v-flex>
          <v-flex class="students-table-container" sm7>
            <v-subheader>
              Students: 
              <v-spacer /> 
              <v-btn color="info" @click="onAssignStudents">Assign...</v-btn>
            </v-subheader>
           
            <v-data-table
              :headers="students.headers"
              :items="students.items"
              :pagination.sync="students.pagination"
              :hide-actions="true"
              class="elevation-1"
            >
              <template v-slot:items="props">
                <td>{{ props.item.foo }}</td>
                <td class="text-xs-right">{{ props.item.bar }}</td>
              </template>
            </v-data-table>
            
          </v-flex>
            
      
        </v-layout>
      </v-card-text>
    </v-card>

    <AssignStudentsDialog ref="assignStudentsDialog" />

  </AppPage>

</template>

<style>

.assignment-page {
  height: 100%;
  width: 100%;
}

.assignment-page > div,
.assignment-page .v-card {
  height: 100%;
  width: 100%;
}

.assignment-page .layout {
  height: calc(100vh - 100px)
}


.assignment-editor {
  height: calc(100vh - 145px);
  width: 100%;
}

.assignment-editor .v-card {
  height: 100%;
}

.assignment-page .students-table-container {
  margin-left: 24px;
  overflow-y: scroll;
}

</style>
