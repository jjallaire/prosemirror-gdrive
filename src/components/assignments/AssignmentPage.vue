


<script>

import AppPage from '../core/AppPage.vue'

import EditorComponent from '../editor/EditorComponent.vue'

import PopupMenu from '../core/PopupMenu'
import MenuTile from '../core/MenuTile'

import drive from '../../drive'
import DriveSave from '../../drive/save'
import config from '../../config'
import driveChanges from '../../drive/changes'

import dialog from '../core/dialog'

import { docInfo } from '../../store/state'
import { SET_DOC, SET_SAVE_STATUS } from '../../store/mutations'

import AssignStudentsDialog from './AssignStudentsDialog.vue'

import { Status, studentAssignments, setStudentAssignmentStatus } from './assignment'

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
            text: 'Grade',
            align: 'center',
            value: 'grade'
          },
          { 
            text: 'Actions', 
            sortable: false , 
            width: '5%'
          }
        ],
        items: [],
        pagination: {
          sortBy: 'status',
          descending: false,
        },
        loading: false,
      }
    }
  },

  computed: {
    ...mapGetters([
      'user',
      'save_status'
    ]),
  },

  mounted() {

    this.$refs.page.initialize(
      drive.getFile(this.doc_id)
        .then(file => {
      
          // parse content
          let content = JSON.parse(file.content);

          // set doc info
          this.$store.commit(
            SET_DOC, 
            docInfo(this.doc_id, file.metadata.name, file.metadata.headRevisionId, file.metadata.properties)
          );

          // set save status
          this.$store.commit(SET_SAVE_STATUS, "clean");
      
          // monitor and save editor changes (triggered by onUpdate hook installed below)
          this.driveSave = new DriveSave(
            this.doc_id,
            this.onSaveStatus,
            this.onSave,
            null,
            this.onSaveError,
            config.gdrive.assignmentMimeType
          );
        
          // initialize editor
          this.$refs.editor.initialize({
            content: content.document,
            onUpdate: this.onEditorUpdate,
            autoFocus: true
          });

          // load students
          this.updateStudents();

          // update students on drive changees
          driveChanges.subscribe(this.updateStudents);
        })
        
    );
  },

  beforeDestroy() {
    driveChanges.unsubscribe(this.updateStudents);
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

    onSave() {
      return {
        // extra fields here
      }
    },

    onSaveStatus(status) {
      this.$store.commit(SET_SAVE_STATUS, status);
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
    },

    onAssignmentClicked(doc) {
      this.$router.push({ path: "/edit/" + doc.id });
    },

    statusText(status) {
      switch(status) {
        case Status.TeacherReview: 
          return "Draft Review";
        case Status.TeacherEvaluate:
          return "Final Review";
        case Status.StudentDraft:
          return "Draft";
        case Status.StudentRevision:
          return "Revising";
        case Status.Complete:
          return "Completed";
        case Status.Unassigned:
          return "Unassigned";
      }
    },
    
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
              class="student-assignments elevation-1"
            >
              <template v-slot:no-data>
                <div class="table-status text-xs-center grey--text">
                  <span v-if="students.loading">Loading...</span>
                  <span v-else>(No students assigned)</span>
                </div>
              </template>

              <template v-slot:items="props">
                <tr class="table-row">
                  <td @click="onAssignmentClicked(props.item)">{{ props.item.student }}</td>
                  <td class="text-xs-left" @click="onAssignmentClicked(props.item)">{{ statusText(props.item.status) }}</td>
                  <td class="text-xs-center" @click="onAssignmentClicked(props.item)">
                    <span v-if="props.item.grade">{{ props.item.grade }}</span>
                    <span v-else>&mdash;</span>
                  </td>
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

.student-assignments .table-row {
  cursor: pointer;
}

</style>
