

<script>

import { VBtn, VIcon, VDivider } from 'vuetify/lib'

export default {

  name: 'EditorToolbar',

  components: {
    VBtn, VIcon, VDivider
  },

  props: {
    editor: {
      type: Object,
      default: null
    }
  },

  computed: {
    isActive: function() {
      return this.editor.isActive;
    },
    commands: function() {
      return this.editor.commands;
    }
  }

}


</script>

<template>

  <span v-if="editor" class="editor-toolbar">
    
    <v-btn flat title="Undo" @click="commands.undo">
      <v-icon>undo</v-icon>
    </v-btn>

    <v-btn flat title="Redo" @click="commands.redo">
      <v-icon>redo</v-icon>
    </v-btn>
    
    <v-divider inset vertical />

    <v-btn flat title="Bold" :class="{ 'v-btn--active': isActive.strong() }" @click="commands.strong">
      <v-icon>format_bold</v-icon>
    </v-btn>

    <v-btn flat title="Italic" :class="{ 'v-btn--active': isActive.em() }" @click="commands.em">
      <v-icon>format_italic</v-icon>
    </v-btn>

    <v-btn flat title="Code" :class="{ 'v-btn--active': isActive.code() }">
      <v-icon>code</v-icon>
    </v-btn>

    <v-divider inset vertical />

    <v-btn flat title="Bullet list" :class="{ 'v-btn--active': isActive.bullet_list() }">
      <v-icon>list</v-icon>
    </v-btn>

    <v-btn flat title="Numbered list" :class="{ 'v-btn--active': isActive.ordered_list() }">
      <v-icon>format_list_numbered</v-icon>
    </v-btn>

    <v-btn flat title="Blockquote" :class="{ 'v-btn--active': isActive.blockquote() }">
      <v-icon>format_quote</v-icon>
    </v-btn>

  </span>

</template>


<style>

.editor-toolbar .v-btn {
  height: 24px;
  padding: 0;
  min-width: inherit;
  margin: 0 1px;
  padding: 0 3px;
  color: rgba(100,100,100,1);
}

.editor-toolbar .v-btn--active {
  background-color :rgba(192,192,192,0.1);
}

.editor-toolbar .v-divider--vertical.v-divider--inset {
  height: 15px;
  margin: 0 5px;
}

</style>

