<script>

import { VTextField } from 'vuetify/lib'

export default {

  name: 'EditorDocTitle',

  components: {
    VTextField
  },

  props: {
    value: {
      type: String,
      default: null
    }
  }
}

</script>

<template>

  <v-text-field 
    :value="value" 
    class="editor-document-title" 
    v-on="$listeners"
  />

</template>

<style>

.editor-document-title {
  margin-top: 18px !important;
  /*font-size: 1.2em;*/
  color: rgba(100,100,100,1);
  padding: 5px;
}

.editor-document-title > .v-input__control > .v-input__slot:before {
  border-width: 0;
}

.editor-document-title input {
  margin-top: 3px;
  padding-left: 3px;
  margin-left: -3px;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 0.02em;
  width: 500px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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