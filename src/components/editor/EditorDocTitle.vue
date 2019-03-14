<script>

import { VTextField } from 'vuetify/lib'

import _debounce from 'lodash/debounce'

import drive from '../../drive'

export default {

  name: 'EditorDocTitle',

  components: {
    VTextField
  },

  props: {
    doc_id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },

  methods: {
     onTitleChanged: _debounce(function(value) {
      drive
        .renameFile(this.doc_id, value)
        .then(() => {
          drive.updateRecentDocs();
        })
        .catch(error => {
          this.$dialog.error({
            text: error.message,
            title: "Drive Error"
          })
        });
    }, 1000),
  }

}

</script>

<template>

  <v-text-field :value="title" class="editor-document-title" @input="onTitleChanged" />

</template>

<style>

.editor-document-title {
  margin-top: 20px !important;
  font-size: 1.2em;
  color: rgba(100,100,100,1);
  padding: 5px;
}

.editor-document-title > .v-input__control > .v-input__slot:before {
  border-width: 0;
}

.editor-document-title input {
  margin-top: 5px;
  padding-left: 3px;
  margin-left: -3px;
}

.editor-document-title input:hover {
  outline: 1px solid;
  outline-color: rgba(0,0,0,0.1);
}

.editor-document-title input:focus {
  outline: none;
}

.editor-document-title > .v-input__control:hover > .v-input__slot:before {
  border-width: 0;
}


</style>