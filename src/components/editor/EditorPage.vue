<script>

import { EditorContent } from 'tiptap'

import editor from './editor'

import EditorToolbar from './EditorToolbar.vue'

import * as utils from '../core/utils'
import drive from '../../drive'

import ErrorDisplay from '../core/ErrorDisplay.vue'
import ProgressSpinner from '../core/ProgressSpinner.vue'

export default {
  name: 'EditorPage',

  components: {
    ProgressSpinner, ErrorDisplay, EditorContent, EditorToolbar
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
      error: null
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
            this.editor = editor.create(this.doc.content);

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

    destroyEditor() {
      if (this.editor) {
        this.editor.destroy();
        this.editor = null;
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
      <!-- show title dialog -->
    </div>
    <div v-else-if="doc">
      <v-card class="edit-card card--flex-toolbar">
        <v-toolbar
          card
          dense
          :height="32"
          prominent
          extended
          :extension-height="32"
        >
          <template v-slot:extension>
            <EditorToolbar :editor="editor" />
          </template>

          <v-toolbar-title class="document-title">{{ doc.metadata.name }}</v-toolbar-title>

          <v-spacer />

          <v-btn icon>
            <v-icon>more_vert</v-icon>
          </v-btn>
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
  padding: 0 16px;
}

.edit-container .edit-card .v-btn--icon {
  margin: 6px 0;
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
  font-size: 1.2em;
}

.edit-container .ProseMirror {
  outline: none;
}
</style>