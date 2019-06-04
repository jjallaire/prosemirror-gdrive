


<script>

import AppPage from '../core/AppPage.vue'

import EditorComponent from '../editor/EditorComponent.vue'

import PopupMenu from '../core/PopupMenu'
import MenuTile from '../core/MenuTile'

import drive from '../../drive'
import DriveSave from '../../drive/save'
import config from '../../config'

import dialog from '../core/dialog'

import { docInfo } from '../../store/state'
import { SET_DOC } from '../../store/mutations'

import AssignStudentsDialog from './AssignStudentsDialog.vue'

import { Status, studentAssignments, setStudentAssignmentStatus } from '../core/assignment'

import { mapGetters } from 'vuex'


export default {

  name: 'AssignmentPage',

  components: {
    AppPage, EditorComponent, AssignStudentsDialog, PopupMenu, MenuTile
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
          },
          { 
            text: 'Actions', 
            sortable: false , width: '5%'
          }
        ],
        items: [],
        pagination: {
          sortBy: 'bar',
          descending: true,
        },
        loading: false,
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
            config.gdrive.assignmentMimeType
          );
        
          // initialize editor
          this.$refs.editor.initialize({
            content: JSON.parse(file.content).document,
            onUpdate: this.onEditorUpdate,
            autoFocus: true
          });

          // load students
          this.updateStudents();
        })
        
    );
  },

  beforeDestroy() {
    this.$store.commit(SET_DOC, docInfo());
  },

  methods: {

    updateStudents(clear = false) {
      if (clear)
        this.students.items = [];
      this.students.loading = true;
      studentAssignments(this.doc_id)
        .then(assignments => {
          this.students.items = assignments.filter(assignment => assignment.status !== Status.Unassigned);
          this.students.loading = false;
        })
        .catch(error => {
          dialog.error("Error", error.message);
          this.students.loading = false;
        });
    },
    
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
      this.$refs.assignStudentsDialog
        .show(this.doc_id, this.user.email)
        .then(() => {
          this.updateStudents();
        });
    },

    onUnassign(assignment) {
      setStudentAssignmentStatus(assignment.id, Status.Unassigned)
        .then(() => {
          this.updateStudents();
        })
        .catch(error => {
          dialog.errorSnackbar(error.message);
        })
    },

    onOpenInNewTab(assignment) {
      window.open("/edit/" + assignment.id, "_blank");
    }
  },

 

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
              :loading="students.loading"
              :hide-actions="true"
              class="elevation-1"
            >
              <template v-slot:no-data>
                <div class="table-status text-xs-center grey--text">
                  <span v-if="students.loading">Loading...</span>
                  <span v-else>(No students assigned)</span>
                </div>
              </template>

              <template v-slot:items="props">
                <tr class="table-row">
                  <td>{{ props.item.student }}</td>
                  <td class="text-xs-right">{{ props.item.status }}</td>
                  <td align="center">
                    <PopupMenu>
                      <MenuTile icon="delete" text="Unassign" @clicked="onUnassign(props.item)" />
                      <MenuTile icon="open_in_new" text="Open in new tab" @clicked="onOpenInNewTab(props.item)" />
                    </PopupMenu>
                  </td>
                </tr>
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
