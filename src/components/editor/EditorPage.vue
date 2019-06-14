<script>

import { docInfo } from '../../store/state'
import { SET_DOC, SET_SAVE_STATUS, SET_PAGE_TITLE, SET_PAGE_TITLE_LINK, SET_PAGE_SUBTITLE } from '../../store/mutations'
import { mapGetters } from 'vuex'

import ProsemirrorEditor from '../../prosemirror'
import EditorToolbar from './EditorToolbar.vue'
import EditorSaveStatus from './EditorSaveStatus.vue'

import EditorLinkDialog from './dialogs/EditorLinkDialog.vue'
import EditorImageDialog from './dialogs/EditorImageDialog.vue'

import { actionButton, statusMessage } from './actions/manager.js'
import EditorSubmitDraftButton from './actions/EditorSubmitDraftButton.vue'
import EditorReturnDraftButton from './actions/EditorReturnDraftButton.vue'
import EditorSubmitFinalDraftButton from './actions/EditorSubmitFinalDraftButton.vue'
import EditorAssignGradeButton from './actions/EditorAssignGradeButton.vue'


import { Status } from '../assignments/assignment.js'
import AssignmentSidebar from '../assignments/AssignmentSidebar.vue'
import CommentsSidebar from '../comments/CommentsSidebar.vue'

import config from '../../config'
import drive from '../../drive'
import DriveSave from '../../drive/save'
import driveChanges, { docSyncHandler } from '../../drive/changes'

import ErrorPanel from '../core/ErrorPanel.vue'
import ProgressSpinner from '../core/ProgressSpinner.vue'
import PopupMenu from '../core/PopupMenu'
import MenuTile from '../core/MenuTile'

import dialog from '../core/dialog'

import printJS from 'print-js'
import { isTeacher } from '../../store/selectors';

export default {
  name: 'EditorPage',

  components: {
    ProgressSpinner, ErrorPanel, 
    EditorToolbar, EditorSaveStatus,
    PopupMenu, MenuTile,
    EditorLinkDialog, EditorImageDialog,
    AssignmentSidebar, CommentsSidebar,
    EditorSubmitDraftButton, EditorReturnDraftButton, 
    EditorSubmitFinalDraftButton, EditorAssignGradeButton
  },

  props: {
    doc_id: {
      type: String,
      default: null
    }
  },

  data: function() {
    return {
    
      // editor
      editor: null,

      // sidebars
      sidebar: 'assignment',
      sidebars: [
        {
          text: 'Assignment',
          value: 'assignment'
        },
        {
          text: 'Comments',
          value: 'comments'
        }
      ],

      // save and sync managers
      driveSave: null,
      syncHandler: null,

      // load error
      error: null,
    }
  },

  computed: {

    ...mapGetters([
      'doc',
      'save_status',
      'user'
    ]),

    status: function() {
      return this.doc.properties.status;
    },

    grade: function() {
      return this.doc.properties.grade;
    },

    is_teacher: function() {
      return isTeacher(this.user);
    },

    is_editor: function() {
      return this.doc.properties.student === this.user.email;
    },

    editable: function() {
      return this.is_editor && 
             (this.status === Status.StudentDraft || this.status === Status.StudentRevision);
    },


    // active action_button (if there is no active action then
    // a status_message will be shown)
    action_button: function() {
      return actionButton(this.user, this.status);
    },

    // active status message (shown in place of action_button when 
    // no actions are possible)
    status_message: function() {
      return statusMessage(this.user, this.status, this.grade);
    },

    page_subtitle: function() {
      if (!this.is_editor) {
        return this.doc.properties.student;
      } else {
        return null;
      }
    },

    page_title_link: function() {
      if (this.is_teacher)
        return "/assignment/" + this.doc.properties.assignmentId;
      else
        return null;
    }
  },

  mounted() {

    drive.getFile(this.doc_id)
      .then(file => {

        // if this is an assignment then re-route it
        let mimeType = file.metadata.mimeType;
        if (mimeType === config.gdrive.assignmentMimeType) {
          this.$router.push({ path: "/assignment/" + this.doc_id});
          return;
        }

        // parse content
        let content = JSON.parse(file.content);

        // set doc info
        this.$store.commit(
          SET_DOC, 
          docInfo(this.doc_id, file.metadata.name, file.metadata.headRevisionId, file.metadata.properties, content.description)
        );
        this.$store.commit(SET_PAGE_TITLE, file.metadata.name, this.page_title_link);
        this.$store.commit(SET_PAGE_TITLE_LINK, this.page_title_link);
        this.$store.commit(SET_PAGE_SUBTITLE, this.page_subtitle);

        // set save status
        this.$store.commit(SET_SAVE_STATUS, "clean");
       
        // monitor and save editor changes (triggered by onUpdate hook installed below)
        this.driveSave = new DriveSave(
          this.doc_id,
          this.onSaveStatus,
          this.onSave,
          this.onSaved,
          this.onSaveError,
          config.gdrive.studentAssignmentMimeType
        );

        // synchronize to changes made in other browsers
        this.syncHandler = docSyncHandler(
          this.doc_id,
          () => this.doc,
          this.onSyncMetadata,
          this.onSyncDoc,
          this.onSyncError
        );

        // get editor document
        return this.editorContent(content);
      })
      .then(content => {

        // initialize editor
        this.editor = new ProsemirrorEditor(this.$refs.prosemirror, {
          autoFocus: true,
          editable: true,
          content: content.base,
          content_revision: content.revision,
          hooks: {
            isEditable: () => this.editable,
            onUpdate: this.onEditorUpdate,
            onSelectionChanged: this.onEditorSelectionChanged,
            onEditLink: this.onEditLink,
            onEditImage: this.onEditImage
          }
        });

        // subscribe to file changes
        return driveChanges.subscribe(this.syncHandler);
      })
      .then(() => {
        return drive.setFileViewed(this.doc_id);
      })
      .catch(error => {
        // if we haven't yet authorized then open within the drive UI
        if (error.code === 403 && error.reason === "appNotAuthorizedToFile") {
          let docURL = `https://drive.google.com/open?id=${this.doc_id}`;
          window.location.href = docURL;
          return;
        }

        // record the error 
        this.error = error;
      });
  },

  beforeDestroy() {

    this.$store.commit(SET_DOC, docInfo());
    this.$store.commit(SET_PAGE_TITLE, null);
    this.$store.commit(SET_PAGE_TITLE_LINK, null);
    this.$store.commit(SET_PAGE_SUBTITLE, null);

    if (this.editor) {
      this.editor.destroy();
      this.editor = null;
      driveChanges.unsubscribe(this.syncHandler);
    }
  },

  methods: {

    onEditorSelectionChanged(selection) {
      if (selection.type === 'node') {
        this.$refs.prosemirror.classList.add("has-node-selection");
      } else {
        this.$refs.prosemirror.classList.remove("has-node-selection");
      }
    },

    onEditorUpdate(update) {
      if (this.editable)
        this.driveSave.onEditorUpdate(update);
    },

    onEditLink(link) {
      return this.$refs.linkDialog.show(link);
    },

    onEditImage(image) {
      return this.$refs.imageDialog.show(image);
    },

    onSaveStatus(status) {
      this.$store.commit(SET_SAVE_STATUS, status);
    },

    onSave() {
      return {
        description: this.doc.description
      }
    },

    onSaved(result) {
      this.doc.headRevisionId = result.headRevisionId;
    },

    onSaveError(error) {
      dialog.errorSnackbar(
        "Unable to save changes (" + error.message + "). " +
        "Please ensure you are online so that you don't lose work."
      );
    },

    onDriveChanged(changes) {
      this.syncManager.onDriveChanged(changes);
    },

    onSyncMetadata(metadata) {
      this.$store.commit(
        SET_DOC,
        docInfo(this.doc_id, metadata.name, metadata.headRevisionId, metadata.properties, this.doc.description)
      );
      this.$store.commit(SET_PAGE_TITLE, metadata.name);
      this.$store.commit(SET_PAGE_TITLE_LINK, this.page_title_link);
      this.$store.commit(SET_PAGE_SUBTITLE, this.page_subtitle);
    },

    onSyncDoc(file) {
      // get file content
      let content = JSON.parse(file.content);
      this.$store.commit(
        SET_DOC,
        docInfo(this.doc_id, file.metadata.name, file.metadata.headRevisionId, file.metadata.properties, content.description)
      );

      // see if we have a revision to present
      this.editorContent(content).then(content => {
         this.editor.setContent(content.base, content.revision);
      })
    },

    onSyncError(error) {
      dialog.errorSnackbar(
        "Error attempting to synchronize changes from Drive: " +
        error.message
      );
    },

    onPrintDocument() {
      printJS({
        printable: 'prosemirror',
        type: 'html',
        header: this.doc.title,
        headerStyle: 'font-size: 24pt; font-weight: bold; font-family: Georgia,Helvetica,"Times New Roman",Times,serif;',
        css: '/styles/print.css'
      });
    },

    onEditorAction(handler) {
      handler({
        id: this.doc_id,
        properties: this.doc.properties,
        getHTML: () => {
          return this.editor.getHTML();
        },
        setProperties: (properties) => {
          return drive
            .setFileProperties(this.doc_id, properties)
            .then(() => {
              this.doc.properties = {
                ...this.doc.properties,
                ...properties
              }
            })
            .catch(error => {
              dialog.errorSnackbar("Error setting file properties: " + 
                                    error.message);
            })
        }
      });
    },


    editorContent(content) {

      // is this teacher evaluation mode and do we have a draft as a baseline?
      if ((this.status === Status.TeacherEvaluate || this.status === Status.Complete) && 
          this.doc.properties.draftRevisionId) {
        return drive
          .getRevision(this.doc_id, this.doc.properties.draftRevisionId, true)
          .then(revisionContent => {
            return {
              base: revisionContent.document,
              revision: content.document
            }
          })
      } else {
        return Promise.resolve({
          base: content.document,
          revision: null
        });
      }
      

      
    }

  }
}

</script>

<template>

  <div class="edit-container">
    <div v-show="editor">
      <v-card class="edit-card card--flex-toolbar">
        <v-toolbar card dense :height="40">
       
          <EditorToolbar :editor="editor" />
          <EditorSaveStatus :status="save_status" />
                 
          <v-spacer />
  
          <EditorSubmitDraftButton v-if="action_button === 'submit-draft'" />
          <EditorReturnDraftButton v-if="action_button === 'return-draft'" />
          <EditorSubmitFinalDraftButton v-if="action_button === 'submit-final-draft'" />
          <EditorAssignGradeButton v-if="action_button === 'assign-grade'" />

          <v-chip v-if="status_message" class="status-message" color="info" disabled label outline>{{ status_message }}</v-chip>

          <PopupMenu>
            <MenuTile icon="print" text="Print Document..." @clicked="onPrintDocument" />
          </PopupMenu>
          
        </v-toolbar>

        <v-divider />

        <div id="prosemirror" ref="prosemirror" />

        <div id="prosemirror-sidebar">
          <v-select v-model="sidebar " :items="sidebars" solo flat />
          <AssignmentSidebar v-show="sidebar == 'assignment'" />
          <CommentsSidebar v-show="sidebar == 'comments'" />
        </div>
        
      </v-card>
    </div>

    <div v-if="error">
      <ErrorPanel :error="error" />
    </div>
    
    <div v-else-if="!editor">
      <ProgressSpinner />
    </div>

    <EditorLinkDialog ref="linkDialog" />
    <EditorImageDialog ref="imageDialog" />

  </div>
  
</template>

<style>

.edit-container {
  width: 100%;
  height: 100%;
}

.edit-container > div {
  height: 100%;
}

.edit-container .edit-card {
  height: 100%;
  position: relative;
}

.edit-container .edit-card .v-toolbar__content,
.edit-container .edit-card .v-toolbar__extension {
  padding: 0 8px;
}

.edit-container .edit-card .v-btn--icon {
  margin: 6px 0;
}

.edit-container .edit-card .editor-save-status {
  margin-left: 10px;
}

.edit-container .v-toolbar__content  .v-btn--small {
  padding: 0 10px;
  min-width: inherit;
}

.edit-container .v-toolbar__content .v-btn__content {
  text-transform: none;
}

.edit-container .editor-save-status {
  margin-right: 5px;
}

.edit-container .status-message {
  height: 28px;
  font-size: 14px;
  font-weight: 500;
}

.edit-container .v-chip.v-chip.v-chip--outline,
.edit-container .v-chip__content {
  height: 28px;
}

.edit-container #prosemirror {
  padding: 12px;
  padding-right: 36px;
  position: absolute;
  top: 39px;
  left: 0;
  bottom: 0;
  right: 300px;
  overflow-y: scroll;
}

.edit-container #prosemirror-sidebar {

  position: absolute;
  top: 41px;

  bottom: 0;
  right: 0;
  overflow-y: scroll;
  width: 300px;
  background-color:#f5f5f5;
  border-left: 1px solid rgba(0,0,0,0.12);
}


.ProseMirror {
  outline: none;
}

.ProseMirror .insertion {
  color: rgb(13,103,87);
  background-color: rgb(217,239,238);
  
}

.ProseMirror .deletion {
  color:#E53935;
  background-color: #FFCDD2;
}

.ProseMirror p {
  margin-bottom: initial;
}

.ProseMirror code {
  color: inherit;
  background-color: inherit;
  font-size: inherit;
  font-weight: inherit;
  border-radius: initial;
  box-shadow: none;
}

.ProseMirror code:before,
.ProseMirror code:after {
  content: ''
}

.ProseMirror pre code {
  width: 100%;
  margin-bottom: 16px;
}

.ProseMirror hr {
  margin-top: 8px;
  margin-bottom: 16px;
  border: 0;
  height: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.ProseMirror blockquote {
  padding-left: 1em;
  border-left: 3px solid #eee;
  margin-left: 0;
  margin-right: 0;
}

.ProseMirror li > p {
  margin-bottom: 5px;
}

.ProseMirror li:last-of-type > p {
  margin-bottom: 16px;
}

.ProseMirror img {
  height: auto;
}

.has-node-selection .ProseMirror .ProseMirror-selectednode {
  outline: 2px solid #b3d4fc;
}

#prosemirror-sidebar .v-messages {
  min-height: 0;
}

#prosemirror-sidebar .v-text-field.v-text-field--enclosed .v-text-field__details {
    margin-bottom: 0;
}

#prosemirror-sidebar .v-input__slot {
  color: rgba(0,0,0,0.87);
  background-color: #f5f5f5;
  border-bottom: 1px solid rgba(0,0,0,0.12);
  margin-bottom: 0;
}


#prosemirror-sidebar .v-select__selection {
  font-size: 0.9em;
  color: rgba(0,0,0,0.6);
}

#prosemirror-sidebar .v-text-field.v-text-field--solo .v-input__control {
  min-height: 0;
}


</style>