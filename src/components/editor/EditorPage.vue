<script>

import { EditorContent } from 'tiptap'

import _throttle from 'lodash/throttle'

import editor from './editor'

import EditorToolbar from './EditorToolbar.vue'
import EditorShareButton from './EditorShareButton.vue'
import EditorDocTitle from './EditorDocTitle.vue'
import EditorSaveError from './EditorSaveError.vue'

import * as utils from '../core/utils'
import drive from '../../drive'

import ErrorDisplay from '../core/ErrorDisplay.vue'
import ProgressSpinner from '../core/ProgressSpinner.vue'
import PopupMenu from '../core/PopupMenu'
import MenuTile from '../core/MenuTile'

export default {
  name: 'EditorPage',

  components: {
    ProgressSpinner, ErrorDisplay, EditorContent, 
    EditorToolbar, EditorShareButton, EditorDocTitle, EditorSaveError,
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

      // document (or document load error)
      doc: null,
      error: null,
      
      // editor
      editor: null,
      editor_updates: {
        last: null,
        last_save_time: null
      },

      // save errors
      save_error: null,
    }
  },

  watch: {
    '$route': 'initDoc'
  },

  mounted() {
    this.initDoc();
  },

  beforeDestroy() {
    this.destroyEditor();
  },

  methods: {

    initDoc() {

      this.doc = null;
      this.error = null;
      this.snackbar = null;
      this.snackbar_error = null;
      this.destroyEditor();

      if (this.doc_id === null) {
        
        if (this.$route.query.newDoc) {
          this.createNewDoc(this.$route.query.newDoc);
        } else {
          this.$dialog.prompt({
            text: 'Title',
            title: 'New Document'
          })
          .then(title => {
            if (title)
              this.createNewDoc(title);
            else
              this.$router.push({ path: "/" });
          });
          utils.focusDialogTitle();
        }
      } else {
        drive.loadFile(this.doc_id)
          .then(doc => {

            // set doc
            this.doc = doc;

            // initialize editor
            this.editor = this.createEditor();

            // mark file viewed
            return drive.setFileViewed(this.doc_id);
          })
          .then(() => {
            drive.updateRecentDocs();
          })
          .catch(error => {
            this.error = error;
          });
      }
    },

    createEditor() {

      // determine initial editor content (either an empty string for a
      // new document or json for an existing document)
      let content = this.doc.content;
      if (content.length > 0)
        content = JSON.parse(content);
    
      // create a throttled version of saveToDrive
      let saveLastUpdateThrottled = _throttle(
        this.saveLastUpdate,
        3000, 
        { leading: false, trailing: true }
      );

      // create and return the editor
      return editor.create(

        // initial content
        content,

        // on update
        update => {
          this.editor_updates.last = update;
          saveLastUpdateThrottled();
        }
      );
    },

    destroyEditor() {
      if (this.editor) {
        this.editor.destroy();
        this.editor = null;
      }
      this.editor_updates = {
        last: null,
        last_save_time: null
      }
    },

    createNewDoc(title) {
      drive
        .newFile(title)
        .then(id => {
          this.$router.push({ path: "/edit/" + id });
        })
        .catch(error => {
          this.error = error;
        });
    },

    saveLastUpdate() {
      let update = this.editor_updates.last;
      this.save_error = null;
      drive
        .saveFile(
          this.doc.metadata.id, 
          JSON.stringify(update.getJSON()), 
          update.getHTML()
        )
        .then(() => {
          this.editor_updates.last_save_time = update.transaction.time;
        })
        .catch(error => {

          // default error code and message
          let code = null;
          let message = error.message;

          // handle GAPIError
          if (error.name === "GAPIError") {

            // record code
            code = error.code;

            // add code to message if we have one
            if (code > 0)
              message = error.code + " - " + message;

            // TODO: exponential retry
            console.log("Error code: " + error.code);
          }

          // set error status 
          this.save_error = 
            "Unable to save changes (" + message + "). " +
            "Please ensure you are online so that you don't lose work.";
        });
    },
  }
}

</script>


<template>

  <div class="edit-container">
    <div v-if="error">
      <ErrorDisplay :error="error" />
    </div>
    <div v-else-if="!doc_id">
      <!-- show title dialog -->
    </div>
    <div v-else-if="doc">
      <v-card class="edit-card card--flex-toolbar">
        <v-toolbar
          card
          dense
          :height="34"
          prominent
          extended
          :extension-height="32"
        >
          <template v-slot:extension>
            <EditorToolbar :editor="editor" :editor_updates="editor_updates" />
          </template>

          <EditorDocTitle :doc_id="doc_id" :title="doc.metadata.name" />
                   
          <v-spacer />
  
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
    <div v-else>
      <ProgressSpinner />
    </div>

    <EditorSaveError :error="save_error" @closed="save_error = null" />
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

.edit-container .ProseMirror {
  outline: none;
}
</style>