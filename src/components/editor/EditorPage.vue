<script>

import * as utils from '../core/utils'
import drive from '../../drive'

import ErrorDisplay from '../core/ErrorDisplay.vue'
import ProgressSpinner from '../core/ProgressSpinner.vue'

export default {
  name: 'EditorPage',

  components: {
    ProgressSpinner, ErrorDisplay
  },

  props: {
    doc_id: {
      type: String,
      default: null
    }
  },

  data: function() {
    return {
      title: null,
      doc: null,
      error: null
    }
  },

  watch: {
    '$route': 'initDoc'
  },

  created() {
    this.initDoc();
  },

  methods: {

    initDoc() {

      this.doc = null;
      this.error = null;

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
            this.title = file.metadata.name;
            this.doc = file;
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
      this.title = title;
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
    }
  }
}

</script>


<template>

  <div class="edit-container">
    <div v-if="error">
      <ErrorDisplay :error="error" />
    </div>
    <div v-else-if="!doc_id && !title">
      <!-- show title dialog -->
    </div>
    <div v-else-if="doc">
      <v-card class="edit-card card--flex-toolbar">
        <v-toolbar
          card
          dense
          prominent
          extended
          :height="28"
        >
          <template v-slot:extension>
            &nbsp;
          </template>

          <v-toolbar-title class="body-2">{{ title }}</v-toolbar-title>

          <v-spacer />

          <v-btn icon>
            <v-icon>search</v-icon>
          </v-btn>

          <v-btn icon>
            <v-icon>apps</v-icon>
          </v-btn>

          <v-btn icon>
            <v-icon>more_vert</v-icon>
          </v-btn>
        </v-toolbar>

        <v-divider />
        <v-card-text> {{ doc.content }}</v-card-text>
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
}

.edit-container .edit-card .v-toolbar__content,
.edit-container .edit-card .v-toolbar__extension {
  padding: 0 16px;
}

.edit-container .edit-card .v-btn--icon {
  margin: 6px 0;
}

</style>