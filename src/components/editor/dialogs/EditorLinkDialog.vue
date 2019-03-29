

<script>

import { VLayout, VFlex, VTextField, VBtn } from 'vuetify/lib'

import ModalDialog from '../../core/ModalDialog.vue'

export default {

  name: 'EditorLinkDialog',

  components: {
    ModalDialog, VLayout, VFlex, VTextField, VBtn
  },

  data: function() {
    return {
      href: null,
      title: null,
      can_remove: false
    }
  },

  methods: {

    show(link) {

      // initialize data
      this.href = link.href;
      this.title = link.title;
      this.can_remove = link.href !== null;

      // show the dialog 
      return this.$refs.dialog.show({
        ok: () => ({
          action: 'edit',
            link: {
              href: this.href,
              title: this.title
          }
        }),
        cancel: null
      });
    },

    onClickRemoveLink() {
      this.$refs.dialog.dismiss({
        action: 'remove'
      });
    }
  }
}

</script>

<template>
  <ModalDialog ref="dialog" caption="Edit Hyperlink">
    <template slot="content">
      <v-layout row wrap>
        <v-flex xs12>
          <v-text-field 
            v-model="href" 
            label="URL" 
            placeholder="https://example.com"
            autofocus
          />
          <v-text-field 
            v-model="title" 
            label="Title" 
            hint="Tooltip displayed when hovering over link" 
          />
        </v-flex>
      </v-layout>
    </template>
    <template slot="left_buttons">
      <v-btn v-if="can_remove" flat @click="onClickRemoveLink">Remove Link</v-btn>
    </template>
  </ModalDialog>

</template>

<style>


</style>