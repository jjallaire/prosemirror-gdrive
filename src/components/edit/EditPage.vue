<script>

import * as utils from '../core/utils'
import drive from '../../drive'

import ErrorDisplay from '../core/ErrorDisplay.vue'
import ProgressSpinner from '../core/ProgressSpinner.vue'

export default {
  name: 'EditPage',

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
        this.$dialog.prompt({
          text: 'Title',
          title: 'New Document'
        })
        .then(title => {
          if (title) {
            this.title = title;
            return drive.newFile(title);
          } else {
            return Promise.resolve();
          }
        })
        .then(id => {
          if (id)
            this.$router.push({ path: "/edit/" + id });
          else
            this.$router.push({ path: "/"} );
        })
        .catch(error => {
          this.error = error;
        });

        // auto-focus title
        utils.focusDialogTitle();

      } else {
        drive.loadFile(this.doc_id)
          .then(file => {
            this.title = file.name;
            this.doc = file;
          })
          .catch(error => {
            this.error = error;
          });
      }
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
      <strong>
        {{ doc_id }}
      </strong>
      <p>
        {{ doc.content }}
      </p>
      <p>
        <button @click="onShareClicked">Share</button>
      </p>
    </div>
    <div v-else>
      <ProgressSpinner />
    </div>
  </div>
  
</template>

<style>

.edit-container { 
  width: 100%;
}


</style>