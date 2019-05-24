

<script>

import { VDialog, VCard, VCardTitle, VCardText, VCardActions, VSpacer, VBtn } from 'vuetify/lib'

import dialog, { dialogAutoFocus } from './dialog.js'

export default {

  name: 'ModalDialog',

  components: {
    VDialog, VCard, VCardTitle, VCardText, VCardActions, VSpacer, VBtn
  },

  props: {
    caption: {
      type: String,
      required: true
    },
    ok_caption: {
      type: String,
      default: "OK"
    }
  },

  data: function() {
    return {
      active: false,
      resolve: null,
      disable_actions: false,
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
      this.disable_actions = false;
      this.handlers = {
        ...this.handlers,
        ...handlers
      }
      dialogAutoFocus(true);
      return new Promise(resolve => {
        this.resolve = resolve;
      });
    },

    disableActions() {
      this.disable_actions = true;
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
      if (result instanceof Promise) {
        result
          .then(this.dismiss)
          .catch(error => {
            dialog.error("Error", error.message);
          }) 
      } else {
        this.dismiss(result);
      }
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
        <v-btn flat :disabled="disable_actions" @click="onClickCancel">Cancel</v-btn>
        <v-btn flat :disabled="disable_actions" color="primary" @click="onClickOK">{{ ok_caption }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style>

.v-dialog .v-card__title .headline {
  font-size: 18px !important;
}

.v-dialog .v-card__text {
  padding-top: 0;
  padding-bottom: 0;
}

.v-dialog .v-textarea {
  margin-top: 8px;
}


</style>