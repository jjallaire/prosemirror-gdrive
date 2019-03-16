<script>

import { EditorContent } from 'tiptap'
import _debounce from 'lodash/debounce'

import editor from './tiptap/editor'

import EditorToolbar from './EditorToolbar.vue'
import EditorShareButton from './EditorShareButton.vue'
import EditorDocTitle from './EditorDocTitle.vue'

import EditorSave from './save/EditorSave.js'
import EditorSaveError from './save/EditorSaveError.vue'
import EditorSaveStatus from './save/EditorSaveStatus.vue'

import * as utils from '../core/utils'
import drive from '../../drive'
import changemonitor from '../../drive/changemonitor'

import ErrorDisplay from '../core/ErrorDisplay.vue'
import ProgressSpinner from '../core/ProgressSpinner.vue'
import PopupMenu from '../core/PopupMenu'
import MenuTile from '../core/MenuTile'

export default {
  name: 'EditorPage',

  components: {
    ProgressSpinner, ErrorDisplay, EditorContent, 
    EditorToolbar, EditorShareButton, EditorDocTitle, EditorSaveError, EditorSaveStatus,
    PopupMenu, MenuTile
  },

  mixins: [EditorSave],

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
     
      // load error
      error: null,
      
      // editor
      editor: null,
    }
  },

  watch: {
    '$route': 'initDoc'
  },

  mounted() {
    this.initDoc();
  },

  beforeDestroy() {
    this.clearDoc();
  },

  methods: {

    initDoc() {

      this.clearDoc();

      // no doc id, create a new doc
      if (this.doc_id === null) {
        
        // title provided in url
        if (this.$route.query.newDoc) {
          this.createNewDoc(this.$route.query.newDoc);

        // need to prompt for title
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

      // bind to doc_id from url
      } else {
        drive.getFile(this.doc_id)
          .then(file => {

            // set doc info
            this.doc = this.docInfo(file.metadata.name, file.metadata.headRevisionId);
           
            // determine initial editor content (empty string or json)
            let content = file.content;
            if (content.length > 0)
              content = JSON.parse(content);

            // initialize editor
            this.editor = editor.create(content, this.onEditorUpdate);

            // subscribe to file changes
            return changemonitor.subscribe(this.onDriveChanged);
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
      }
    },

    clearDoc() {
      this.doc = this.docInfo();
      this.error = null;
      if (this.editor) {
        this.editor.destroy();
        this.editor = null;
        changemonitor.unsubscribe(this.onDriveChanged);
      }
      this.resetSaveStatus();
    },

    createNewDoc(title) {
      drive
        .newFile(title)
        .then(result => {
          this.$router.push({ path: "/edit/" + result.id });
        })
        .catch(error => {
          this.error = error;
        });
    },

    onTitleChanged: _debounce(function(value) {
      drive
        .renameFile(this.doc_id, value)
        // eslint-disable-next-line
        .then(result => {
          this.doc = this.docInfo(value, result.headRevisionId);
          drive.updateRecentDocs();
        })
        .catch(error => {
          this.$dialog.error({
            text: error.message,
            title: "Drive Error"
          })
        });
    }, 1000),

    // eslint-disable-next-line
    onDriveChanged(changes) {
      let thisDocChange = changes.find(change => change.fileId === this.doc_id);
      if (thisDocChange) {
        drive 
          .getFileMetadata(this.doc_id)
          .then(metadata => {
            // if the change has a different revisionId then update
            if (metadata.headRevisionId !== this.doc.headRevisionId) {
              return drive
                .getFile(this.doc_id)
                .then(file => {
                  this.doc = this.docInfo(file.metadata.name, file.metadata.headRevisionId);
                  this.editor.setContent(JSON.parse(file.content));
                });
            } else if (metadata.name !== this.doc.title) {
              this.doc.title = metadata.name;
              return Promise.resolve();
            } else {
              return Promise.resolve();
            }
          })
          .catch(() => {
            // TODO: handle error

          });
      }
    },

    docInfo(title = null, headRevisionId = null) {
      return {
        title: title,
        headRevisionId: headRevisionId
      }
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
      <!-- code will resolve/prompt for title and create new doc -->
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

          <EditorDocTitle :value="doc.title" @input="onTitleChanged" />
                   
          <v-spacer />
  
          <EditorSaveStatus :editor_updates="editor_updates" />
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

    <EditorSaveError :error="save_error" @close="save_error = null" />
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