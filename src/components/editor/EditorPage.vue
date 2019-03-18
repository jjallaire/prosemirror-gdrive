<script>

import { EditorContent } from 'tiptap'
import _debounce from 'lodash/debounce'

import editor from './tiptap/editor'

import EditorToolbar from './EditorToolbar.vue'
import EditorShareButton from './EditorShareButton.vue'
import EditorDocTitle from './EditorDocTitle.vue'

import EditorSaveManager from './EditorSaveManager.js'
import EditorSaveStatus from './EditorSaveStatus.vue'

import drive from '../../drive'
import driveChanges, { docSyncHandler } from '../../drive/changes'

import ErrorPanel from '../core/ErrorPanel.vue'
import ProgressSpinner from '../core/ProgressSpinner.vue'
import PopupMenu from '../core/PopupMenu'
import MenuTile from '../core/MenuTile'

import dialog from '../core/dialog'

export default {
  name: 'EditorPage',

  components: {
    ProgressSpinner, ErrorPanel, EditorContent, 
    EditorToolbar, EditorShareButton, EditorDocTitle, EditorSaveStatus,
    PopupMenu, MenuTile
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
      saveManager: null,
      syncHandler: null,

      // save status
      save_status: "clean",

      // load error
      error: null,
    }
  },

  mounted() {

    drive.getFile(this.doc_id)
      .then(file => {

        // set doc info
        this.doc = this.docInfo(file.metadata.name, file.metadata.headRevisionId);

        // monitor and save editor changes
        this.saveManager = new EditorSaveManager(
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
        this.editor = editor.create(
          this.asEditorContent(file.content), 
          this.onEditorUpdate
        );

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


    onEditorUpdate(update) {
      this.saveManager.onEditorUpdate(update);
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
      this.editor.setContent(this.asEditorContent(doc.content));
    },

    onSyncError(error) {
      dialog.errorSnackbar(
        "Error attempting to synchronize changes from Drive: " +
        error.message
      );
    },

    docInfo(title = null, headRevisionId = null) {
      return {
        title: title,
        headRevisionId: headRevisionId
      }
    },

    asEditorContent(content) {
      if (content.length > 0)
        return JSON.parse(content);
      else
        return content;
    },

  }
}

</script>

<template>

  <div class="edit-container">
    <div v-if="editor">
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
            <MenuTile icon="text_fields" text="Rename..." />
          </PopupMenu>
          
        </v-toolbar>

        <v-divider />

        <v-card-text>
          <editor-content :editor="editor" />
        </v-card-text>

      </v-card>
    </div>

    <div v-else-if="error">
      <ErrorPanel :error="error" />
    </div>
    
    <div v-else>
      <ProgressSpinner />
    </div>

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
  padding: 8px;
  position: absolute;
  top: 65px;
  left: 0;
  bottom: 0;
  right: 0;
  overflow-y: scroll;
}

.edit-container .editor-save-status {
  margin-right: 5px;
}



.edit-container .ProseMirror {
  outline: none;
}
</style>