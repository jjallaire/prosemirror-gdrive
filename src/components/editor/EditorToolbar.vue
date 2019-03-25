

<script>

import EditorToolbarButton from './EditorToolbarButton.vue'
import EditorToolbarMenuBlock from './EditorToolbarMenuBlock.vue'

import { VDivider } from 'vuetify/lib'

export default {

  name: 'EditorToolbar',

  components: {
    EditorToolbarButton, EditorToolbarMenuBlock, VDivider
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
    },
    block_commands: function() {
      return [
        this.commands.paragraph,
        this.commands.heading1,
        this.commands.heading2,
        this.commands.heading3,
        this.commands.heading4,
        this.commands.code_block,
      ]
    }
  }

}

</script>

<template>

  <span v-if="editor" class="editor-toolbar">
    
    <EditorToolbarButton :command="commands.undo" />
    <EditorToolbarButton :command="commands.redo" />
 
    <v-divider inset vertical />

    <EditorToolbarMenuBlock :commands="block_commands" /> 
     
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

    <EditorToolbarButton :command="commands.link" />
    <EditorToolbarButton :command="commands.horizontal_rule" />
    
  </span>

</template>

<style>

.editor-toolbar .v-divider--vertical.v-divider--inset {
  height: 15px;
  margin: 0 5px;
}

</style>

