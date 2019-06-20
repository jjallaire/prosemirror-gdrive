<script>

import { docInfo } from '../../store/state'
import { SET_DOC, SET_SAVE_STATUS, SET_PAGE_TITLE, SET_PAGE_TITLE_LINK, SET_PAGE_SUBTITLE } from '../../store/mutations'
import { mapGetters } from 'vuex'

import ProsemirrorEditor from '../../prosemirror'
import EditorToolbar from './EditorToolbar.vue'
import EditorSaveStatus from './EditorSaveStatus.vue'

import EditorLinkDialog from './dialogs/EditorLinkDialog.vue'
import EditorImageDialog from './dialogs/EditorImageDialog.vue'

import { Status } from '../assignments/assignment.js'
import AssignmentSidebar from '../assignments/AssignmentSidebar.vue'

import config from '../../config'
import drive from '../../drive'
import DriveSave from '../../drive/save'
import driveChanges, { docSyncHandler } from '../../drive/changes'

import ErrorPanel from '../core/ErrorPanel.vue'
import ProgressSpinner from '../core/ProgressSpinner.vue'

import dialog from '../core/dialog'

import { isTeacher } from '../../store/selectors';

export default {
  name: 'EditorPage',

  components: {
    ProgressSpinner, ErrorPanel, 
    EditorToolbar, EditorSaveStatus,
    EditorLinkDialog, EditorImageDialog,
    AssignmentSidebar
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
      'user',
      'action_button',
      'status_message'
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
    },

    show_changes: function() {
      return (this.status === Status.TeacherEvaluate || this.status === Status.Complete) && 
             this.doc.properties.draftRevisionId && 
             this.is_teacher;
    },

    allow_comments: function() {
      return (this.status === Status.TeacherReview || this.status === Status.TeacherEvaluate || this.status == Status.Complete) &&
             this.is_teacher;
    },

    fixed_sidebar: function() {
      return this.sidebar !== 'comments';
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

        // set sidebar based on status
        if (this.status === Status.StudentDraft || this.status === Status.Unassigned) {
          this.sidebar = "assignment"
        } else {
          this.sidebar = "comments";
        }
       
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
        this.editor = new ProsemirrorEditor(
          this.$refs.prosemirror, 
          // options
          {
            autoFocus: true,
            editable: true,
            content: content.base,
            content_revision: content.revision,
          },
          // hooks
          {
            isEditable: () => this.editable,
            onUpdate: this.onEditorUpdate,
            onSelectionChanged: this.onEditorSelectionChanged,
            onEditLink: this.onEditLink,
            onEditImage: this.onEditImage
          }
        );

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


    editorContent(content) {

      // is this teacher evaluation mode and do we have a draft as a baseline?
      if (this.show_changes) {
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
       
          <EditorToolbar :editor="editor" :show_changes="show_changes" :allow_comments="allow_comments" />
          <v-spacer />
          <EditorSaveStatus :status="save_status" />
          <v-select v-model="sidebar" class="select-sidebar" :items="sidebars" solo flat />
  
        </v-toolbar>

        <v-divider />

        <div 
          id="prosemirror" 
          ref="prosemirror" 
          :class="{ fixedSidebar: fixed_sidebar, commentsSidebar: !fixed_sidebar }" 
        />

        <div v-show="fixed_sidebar" id="prosemirror-sidebar">
          <AssignmentSidebar v-show="sidebar == 'assignment'" />
        </div>
        <div v-show="!fixed_sidebar" id="prosemirror-sidebar-background" />
    
        
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
  margin-right: 14px;
}

.edit-container .select-sidebar {
  margin-top: 4px;
  max-width: 292px;
  border-left: 1px solid rgba(0,0,0,0.12);
}

.edit-container .select-sidebar .v-input__control {
  min-height: initial;
  margin-top: 4px;
  font-size: 14px;
  font-weight: 400;

}

.edit-container .select-sidebar .v-input__control > .v-input__slot {
  color: inherit;
  background-color: inherit;
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


.edit-container #prosemirror {
  position: absolute;
  top: 41px;
  left: 0;
  bottom: 0;
  right: 0;
  overflow-y: scroll;
  z-index: 10;
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

.edit-container #prosemirror-sidebar-background {
  position: fixed;
  top: 93px;
  bottom: 8px;
  right: 8px;
  width: 300px;
  background-color:#f5f5f5;
  border-left: 1px solid rgba(0,0,0,0.12);
  z-index: 1;
}


.ProseMirror {
  outline: none;
  padding: 12px;
}

 #prosemirror .ProseMirror {
  background-color: #fff;
 }

 .edit-container #prosemirror.fixedSidebar {
  right: 300px;
}

 .edit-container #prosemirror.fixedSidebar .ProseMirror {
  border-right: none;
}

.edit-container #prosemirror.commentsSidebar .ProseMirror {
  display: grid;
  grid-template-columns: [content] auto [comments] 288px; 
  background-color: transparent;
}

.edit-container #prosemirror.commentsSidebar .ProseMirror > * {
  grid-column: content;
}

.edit-container #prosemirror.commentsSidebar .ProseMirror .sidebar-comments {
  grid-column: comments;
  display: contents;
}

 .edit-container #prosemirror.fixedSidebar .ProseMirror .sidebar-comments {
   display: none;
 }

 .edit-container #prosemirror.commentsSidebar .ProseMirror span.comment {
   background-color: pink;
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
  margin-right: 16px;
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