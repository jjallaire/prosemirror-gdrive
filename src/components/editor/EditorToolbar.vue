

<script>

import EditorToolbarButton from './EditorToolbarButton.vue'

import { VDivider } from 'vuetify/lib'

export default {

  name: 'EditorToolbar',

  components: {
    EditorToolbarButton, VDivider
  },

  props: {
    editor: {
      type: Object,
      default: null
    }
  },

  computed: {
    commands: function() {
      return this.editor.commands;
    }
  }

}

</script>

<template>

  <span v-if="editor" class="editor-toolbar">
    
    <EditorToolbarButton :command="commands.undo" />
    <EditorToolbarButton :command="commands.redo" />
 
    <v-divider inset vertical />

    <EditorToolbarButton :command="commands.strong" />
    <EditorToolbarButton :command="commands.em" />
    <EditorToolbarButton :command="commands.code" />
    <EditorToolbarButton :command="commands.underline" />
    <EditorToolbarButton :command="commands.strikethrough" />

    <v-divider inset vertical />

    <EditorToolbarButton :command="commands.bullet_list" />
    <EditorToolbarButton :command="commands.ordered_list" />
    <EditorToolbarButton :command="commands.blockquote" />

    <v-divider inset vertical />

    <EditorToolbarButton :command="commands.paragraph" />
    <EditorToolbarButton :command="commands.code_block" />
    <EditorToolbarButton :command="commands.heading1" />
    <EditorToolbarButton :command="commands.heading2" />


  </span>

</template>

<style>

.editor-toolbar .v-divider--vertical.v-divider--inset {
  height: 15px;
  margin: 0 5px;
}

</style>

