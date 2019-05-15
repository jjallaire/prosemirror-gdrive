

<script>

import { VDialog, VCard, VCardTitle, VCardText, VCardActions, VSpacer, VBtn } from 'vuetify/lib'

import { dialogAutoFocus } from './dialog.js'

export default {

  name: 'ModalDialog',

  components: {
    VDialog, VCard, VCardTitle, VCardText, VCardActions, VSpacer, VBtn
  },

  props: {
    caption: {
      type: String,
      required: true
    }
  },

  data: function() {
    return {
      active: false,
      resolve: null,
      handlers: {
        ok: true,
        cancel: false
      }
    }
  },

  methods: {

    // show the dialog. returns a promise that will be resolved
    // when the dialog is dimissed
    show(handlers) {
      this.active = true;
      this.handlers = {
        ...this.handlers,
        ...handlers
      }
      dialogAutoFocus(true);
      return new Promise(resolve => {
        this.resolve = resolve;
      });
    },

    // dismiss the dialog with a result
    dismiss(result) {
      this.active = false;
      this.resolve(result);
    },

    onClickOK() {
      this.onClick('ok');
    },

    onClickCancel() {
      this.onClick('cancel');
    },

    onClick(action) {
      let handler = this.handlers[action];
      let result = (typeof handler === "function") ? handler() : handler; 
      this.dismiss(result);
    }
  }
}

</script>

<template>
  <v-dialog 
    :value="active" 
    persistent 
    max-width="600"
    @keydown.esc="onClickCancel"
    @keydown.enter="onClickOK"
  >
    <v-card>
      <v-card-title>
        <h3 class="headline">{{ caption }}</h3>
      </v-card-title>
      <v-card-text>
        <slot name="content" />
      </v-card-text>
      <v-card-actions>
        <slot name="left_buttons" />
        <v-spacer />
        <v-btn flat @click="onClickCancel">Cancel</v-btn>
        <v-btn flat color="primary" @click="onClickOK">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style>

.v-dialog .v-card__title .headline {
  font-size: 18px !important;
}


</style>