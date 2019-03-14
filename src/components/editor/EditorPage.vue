<script>

import { EditorContent } from 'tiptap'
 
import { VSnackbar } from 'vuetify/lib'

import _debounce from 'lodash/debounce'
import _throttle from 'lodash/throttle'

import editor from './editor'

import EditorToolbar from './EditorToolbar.vue'

import * as utils from '../core/utils'
import drive from '../../drive'

import ErrorDisplay from '../core/ErrorDisplay.vue'
import ProgressSpinner from '../core/ProgressSpinner.vue'
import PopupMenu from '../core/PopupMenu'
import MenuTile from '../core/MenuTile'

export default {
  name: 'EditorPage',

  components: {
    ProgressSpinner, ErrorDisplay, EditorContent, EditorToolbar, PopupMenu, MenuTile,
    VSnackbar
  },

  props: {
    doc_id: {
      type: String,
      default: null
    }
  },

  data: function() {
    return {
      doc: null,
      editor: null,
      error: null,
      snackbar: null,
      editor_update: {
        last: new Date().getTime(),
        last_saved: new Date().getTime()
      },
      saveToDriveThrottled: _throttle(
        this.saveToDrive,
        5000, 
        { leading: false, trailing: true }
      ),
    }
  },

  computed: {
    dirty: function() {
      return this.editor_update.last > this.editor_update.last_saved;
    },
    saved: function() {
      return this.editor_update.last === this.editor_update.last_saved;
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
          .then(file => {

            // set doc
            this.doc = file;

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
      let saveToDriveThrottled = _throttle(
        this.saveToDrive,
        5000, 
        { leading: false, trailing: true }
      );

      // create and return the editor
      return editor.create(

        // initial content
        content,

        // on update
        update => {
          this.editor_update.last = update.transaction.time;
          saveToDriveThrottled(update);
        }
      );

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

    onShareClicked() {
      drive.shareFile(this.doc_id);
    },

    onNameChanged: _debounce(function(value) {
      this.handleDriveRequest(drive.renameFile(this.doc_id, value))
    }, 1000),

    destroyEditor() {
      if (this.editor) {
        this.editor.destroy();
        this.editor = null;
      }
    },

    saveToDrive(update) {
      drive
        .saveFile(
          this.doc.metadata.id, 
          JSON.stringify(update.getJSON()), 
          update.getHTML()
        )
        .then(() => {
          this.editor_update.last_saved = update.transaction.time;
        })
        .catch(error => {
          // TODO: actually handle errors w/ snackbar and retry
          console.log(error);
        });
    },

    handleDriveRequest(request) {
      request
        .then(() => {
          drive.updateRecentDocs();
        })
        .catch(error => {
          this.$dialog.error({
            text: error.message,
            title: "Drive Error"
          })
        });
    }
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
            <EditorToolbar :editor="editor" />
          </template>

          <v-text-field :value="doc.metadata.name" class="document-title" @input="onNameChanged" />
                   
          <v-spacer />

          <span v-if="saved">
            Saved
          </span>
          <span v-if="dirty">
            Dirty
          </span>

          <v-btn depressed small color="info" @click="onShareClicked">
            <v-icon small light>people</v-icon>
            &nbsp;
            Share
          </v-btn>

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

    <v-snackbar
      v-model="snackbar"
    >
      Snackbar
    </v-snackbar>
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

.edit-container .document-title {
  margin-top: 20px;
  font-size: 1.2em;
  color: rgba(100,100,100,1);
  padding: 5px;
}

.edit-container .edit-card .v-text-field > .v-input__control > .v-input__slot:before {
  border-width: 0;
}

.edit-container .edit-card .v-text-field input {
  margin-top: 5px;
  padding-left: 3px;
  margin-left: -3px;
}

.edit-container .edit-card .v-text-field input:hover {
  outline: 1px solid;
  outline-color: rgba(0,0,0,0.1);
}

.edit-container .edit-card .v-text-field input:focus {
  outline: none;
}

.edit-container .edit-card .v-text-field > .v-input__control:hover > .v-input__slot:before {
  border-width: 0;
}

.edit-container .ProseMirror {
  outline: none;
}
</style>