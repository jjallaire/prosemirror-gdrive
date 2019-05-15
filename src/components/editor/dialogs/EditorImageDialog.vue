

<script>

import { VLayout, VFlex, VTextField, VIcon } from 'vuetify/lib'

import ModalDialog from '../../core/ModalDialog.vue'

import config from '../../../config'

import drive from '../../../drive'

import * as filestack from 'filestack-js';

export default {

  name: 'EditorImageDialog',

  components: {
    ModalDialog, VLayout, VFlex, VTextField, VIcon
  },

  data: function() {
    return {
      src: null,
      title: null,
      width: null,
      filestack_client: null
    }
  },

  created() {
    if (config.filestack.apiKey)
      this.filestack_client = filestack.init(config.filestack.apiKey);
  },

  methods: {

    show(image) {

      // initialize data
      this.src = image.src;
      this.title = image.title;
      this.width = image.width.replace(/%/g, '');      
     
      // show the dialog 
      return this.$refs.dialog.show({
        ok: () => ({
          src: this.src,
          title: this.title,
          width: this.width + "%"
        }),
        cancel: null
      });
    },

    onBrowse() {
      if (this.filestack_client) {
        this.filestack_client.picker({
          onUploadDone: files => {
            if (files.filesUploaded.length > 0)
              this.src = files.filesUploaded[0].url;
          }
        }).open();
      } else {
        drive.selectImage()
        .then(url => {
          this.src = url;
        });
      }
    }
   }
}

</script>

<template>
  <ModalDialog ref="dialog" class="image-dialog" caption="Edit Image">
    <template slot="content">
      <v-layout row wrap>
        <v-flex xs12>
          <v-text-field 
            v-model="src" 
            label="Image URL" 
            placeholder="https://example.com/image.png"
            autofocus
          >
            <template v-slot:append>
              <v-icon title="Image upload/search" @click="onBrowse">photo_library</v-icon>
            </template>
          </v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs9>
          <v-text-field 
            v-model="title" 
            class="image-dialog-title"
            label="Title" 
            placeholder="Tooltip text for image (optional)"
          />
        </v-flex>
        <v-flex xs3>
          <v-text-field
            v-model="width"
            label="Width"
            mask="###"
            suffix="%"
          />
        </v-flex>
      </v-layout>
    </template>
  </ModalDialog>

</template>

<style>

.image-dialog-title {
  margin-right: 10px;
}


</style>