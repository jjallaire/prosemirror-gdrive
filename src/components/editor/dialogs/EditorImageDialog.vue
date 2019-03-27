

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
      can_remove: false
    }
  },

  methods: {

    show(image) {

      // initialize data
      this.src = image.src;
      this.title = image.title;
     
      // show the dialog 
      return this.$refs.dialog.show({
        ok: () => ({
          src: this.src,
          title: this.title
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
      <v-layout row>
        <v-flex md12>
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
      <v-layout row>
        <v-flex md12>
          <v-text-field 
            v-model="title" 
            label="Image Title" 
            hint="Tooltip displayed when hovering over image" 
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