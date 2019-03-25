

<script>

import { VDialog, VCard, VCardTitle, VCardText, 
         VLayout, VFlex, VTextField,
         VCardActions, VSpacer, VBtn } from 'vuetify/lib'

import { dialogAutoFocus } from '../../core/dialog.js'

export default {

  name: 'EditorLinkDialog',

  components: {
    VDialog, VCard, VCardTitle, VCardText, 
    VLayout, VFlex, VTextField,
    VCardActions, VSpacer, VBtn
  },

  data: function() {
    return {
      href: null,
      title: null,
      can_remove: false,
      active: false,
      resolve: null
    }
  },

  methods: {
    show(link) {
      this.href = link.href;
      this.title = link.title;
      this.can_remove = link.href !== null;
      this.active = true;
      dialogAutoFocus(true);
      return new Promise(resolve => {
        this.resolve = resolve;
      });
    },

    onClickOK() {
      this.active = false;
      this.resolve({ 
        action: 'edit',
        link: {
          href: this.href, 
          title: this.title 
        }
      });
    },

    onClickCancel() {
      this.active = false;
      this.resolve(null);
    },

    onClickRemoveLink() {
      this.active = false;
      this.resolve({
        action: 'remove'
      })
    }
  }
}

</script>

<template>
  <v-dialog 
    :value="active" 
    persistent 
    max-width="600"
    @keydown.esc.stop.prevent="onClickCancel"
    @keydown.enter.stop.prevent="onClickOK"
  >
    <v-card>
      <v-card-title>
        <span class="headline">Edit Hyperlink</span>
      </v-card-title>
      <v-card-text>
        <v-layout row>
          <v-flex md12>
            <v-text-field 
              ref="url"
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
      </v-card-text>
      <v-card-actions>
        <v-btn v-if="can_remove" flat @click="onClickRemoveLink">Remove Link</v-btn>
        <v-spacer />
        <v-btn flat @click="onClickCancel">Cancel</v-btn>
        <v-btn flat color="primary" @click="onClickOK">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style>


</style>