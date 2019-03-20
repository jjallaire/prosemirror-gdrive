

<script>

import { VBtn, VIcon } from 'vuetify/lib'

export default {

  name: 'EditorToolbarButton',

  components: {
    VBtn, VIcon
  },

  props: {
    command: {
      type: Object,
      required: true
    }
  }

}

</script>


<template>

  <v-btn 
    flat 
    :disabled="!command.isEnabled()"
    :title="command.title" 
    :class="{ 'editor-toolbar-button': true, 'v-btn--active': command.isLatched()}" 
    @click="command.execute()"
  >
    <v-icon>{{ command.icon }}</v-icon>
  </v-btn>


</template>


<style>

.editor-toolbar-button {
  height: 24px;
  padding: 0;
  min-width: inherit;
  margin: 0 1px;
  padding: 0 3px;
}

.editor-toolbar-button .v-btn__content {
   color: rgba(100,100,100,1);
}

.editor-toolbar-button.v-btn--active {
  background-color :rgba(192,192,192,0.1);
}


</style>