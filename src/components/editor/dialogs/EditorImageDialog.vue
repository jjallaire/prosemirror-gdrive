

<script>

import { VLayout, VFlex, VTextField, VIcon } from 'vuetify/lib'

import ModalDialog from '../../core/ModalDialog.vue'

import drive from '../../../drive'


export default {

  name: 'EditorImageDialog',

  components: {
    ModalDialog, VLayout, VFlex, VTextField, VIcon
  },

  data: function() {
    return {
      src: null,
      title: null,
      alt: null,
      width: null,
      can_remove: false
    }
  },

  methods: {

    show(image) {

      // initialize data
      this.src = image.src;
      this.title = image.title;
      this.alt = image.alt;
      this.width = image.width;
     
      // show the dialog 
      return this.$refs.dialog.show({
        ok: () => ({
          src: this.src,
          title: this.title,
          alt: this.alt,
          width: this.width
        }),
        cancel: null
      });
    },

    onBrowse() {
      drive.selectImage()
        .then(url => {
          this.src = url;
        });
    }
   }
}

</script>

<template>
  <ModalDialog ref="dialog" class="image-dialog" caption="Insert Image">
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
        <v-flex xs12>
          <v-text-field 
            v-model="title" 
            label="Image title" 
          />
        </v-flex>
        <v-flex xs12>
          <v-text-field 
            v-model="alt" 
            label="Alternative text" 
          />
        </v-flex>
      </v-layout>
    </template>
  </ModalDialog>

</template>

<style>

.image-dialog .browse-button {
  min-width: 0 !important;
}

</style>