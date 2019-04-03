<script>

import _debounce from 'lodash/debounce'

import ProsemirrorEditor from '../../prosemirror'

import EditorToolbar from './EditorToolbar.vue'
import EditorShareButton from './EditorShareButton.vue'
import EditorDocTitle from './EditorDocTitle.vue'
import EditorSaveStatus from './EditorSaveStatus.vue'

import EditorLinkDialog from './dialogs/EditorLinkDialog.vue'
import EditorImageDialog from './dialogs/EditorImageDialog.vue'

import drive from '../../drive'
import DriveSave from '../../drive/save'
import driveChanges, { docSyncHandler } from '../../drive/changes'

import ErrorPanel from '../core/ErrorPanel.vue'
import ProgressSpinner from '../core/ProgressSpinner.vue'
import PopupMenu from '../core/PopupMenu'
import MenuTile from '../core/MenuTile'

import dialog from '../core/dialog'

import printJS from 'print-js'

export default {
  name: 'EditorPage',

  components: {
    ProgressSpinner, ErrorPanel, 
    EditorToolbar, EditorShareButton, EditorDocTitle, EditorSaveStatus,
    PopupMenu, MenuTile,
    EditorLinkDialog, EditorImageDialog
  },

  props: {
    doc_id: {
      type: String,
      default: null
    }
  },

  data: function() {
    return {
      // document
      doc: this.docInfo(),
     
      // editor
      editor: null,

      // save and sync managers
      driveSave: null,
      syncHandler: null,

      // save status
      save_status: "clean",

      // load error
      error: null
    }
  },

  mounted() {

    drive.getFile(this.doc_id)
      .then(file => {

        // set doc info
        this.doc = this.docInfo(file.metadata.name, file.metadata.headRevisionId);

        // monitor and save editor changes (triggered by onUpdate hook installed below)
        this.driveSave = new DriveSave(
          this.doc_id,
          this.onSaveStatus,
          this.onSaved,
          this.onSaveError
        );

        // synchronize to changes made in other browsers
        this.syncHandler = docSyncHandler(
          this.doc_id,
          () => this.doc,
          this.onSyncTitle,
          this.onSyncDoc,
          this.onSyncError
        );

        // initialize editor
        this.editor = new ProsemirrorEditor(this.$refs.prosemirror, {
          autoFocus: true,
          editable: true,
          content: file.content,
          hooks: {
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
      .then(() => {
        drive.updateRecentDocs();
      })
      .catch(error => {
        this.error = error;
      });
  },

  beforeDestroy() {
    if (this.editor) {
      this.editor.destroy();
      this.editor = null;
      driveChanges.unsubscribe(this.syncHandler);
    }
  },

  methods: {

    onTitleChanged: _debounce(function(value) {
      drive
        .renameFile(this.doc_id, value)
        .then(result => {
          this.doc = this.docInfo(value, result.headRevisionId);
          drive.updateRecentDocs();
        })
        .catch(error => {
          dialog.error("Drive Error", error.message);
        });
    }, 1000),

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
      this.save_status = status;
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

    onSyncTitle(title) {
      this.doc.title = title;
    },

    onSyncDoc(doc) {
      this.doc = this.docInfo(doc.metadata.name, doc.metadata.headRevisionId);
      this.editor.setContent(doc.content);
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

    onPublishAsGoogleDoc() {
      drive.convertToGoogleDoc(this.doc.title, this.editor.getHTML())
        .then(response => {
          let id = response.id
          window.open(`https://docs.google.com/document/d/${id}/edit`, "_blank");
        })
        .catch(error => {
          dialog.errorSnackbar("Unable to Publish as Google Doc: " + error.message);
        });
    },

    docInfo(title = null, headRevisionId = null) {
      return {
        title: title,
        headRevisionId: headRevisionId
      }
    },
  }
}

</script>

<template>

  <div class="edit-container">
    <div v-show="editor">
      <v-card class="edit-card card--flex-toolbar">
        <v-toolbar card dense :height="34" prominent extended :extension-height="32">

          <template v-slot:extension>
            <EditorToolbar :editor="editor" />
          </template>

          <EditorDocTitle :value="doc.title" @input="onTitleChanged" />
                   
          <v-spacer />
  
          <EditorSaveStatus :status="save_status" />

          <EditorShareButton :doc_id="doc_id" />
          
          <PopupMenu>
            <MenuTile icon="print" text="Print Document..." @clicked="onPrintDocument" />
            <v-divider />
            <MenuTile icon="insert_drive_file" text="Publish as Google Doc" @clicked="onPublishAsGoogleDoc" />
          </PopupMenu>
          
        </v-toolbar>

        <v-divider />

        <v-card-text id="prosemirror" ref="prosemirror" />
        
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

.edit-container .v-toolbar__content  .v-btn--small {
  padding: 0 10px;
  min-width: inherit;
}

.edit-container .v-toolbar__content .v-btn__content {
  text-transform: none;
}

.edit-container .v-card__text {
  padding: 12px;
  position: absolute;
  top: 65px;
  left: 0;
  bottom: 0;
  right: 0;
  overflow-y: scroll
}

.edit-container .editor-save-status {
  margin-right: 5px;
}

.edit-container .ProseMirror {
  outline: none;
}

.edit-container .ProseMirror code {
  color: inherit;
  background-color: inherit;
  font-size: inherit;
  font-weight: inherit;
  border-radius: initial;
  box-shadow: none;
}

.edit-container .ProseMirror code:before,
.edit-container .ProseMirror code:after {
  content: ''
}

.edit-container .ProseMirror pre code {
  width: 100%;
  margin-bottom: 16px;
}

.edit-container .ProseMirror hr {
  margin-top: 8px;
  margin-bottom: 16px;
  border: 0;
  height: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.edit-container .ProseMirror blockquote {
  padding-left: 1em;
  border-left: 3px solid #eee;
  margin-left: 0;
  margin-right: 0;
}

.edit-container .ProseMirror li > p {
  margin-bottom: 5px;
}

.edit-container .ProseMirror li:last-of-type > p {
  margin-bottom: 16px;
}

.edit-container .ProseMirror img {
  height: auto;
}

.edit-container .has-node-selection .ProseMirror .ProseMirror-selectednode {
  outline: 2px solid #b3d4fc;
}


</style>