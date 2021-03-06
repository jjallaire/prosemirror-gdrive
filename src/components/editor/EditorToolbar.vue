

<script>

import EditorToolbarButton from './EditorToolbarButton.vue'
import EditorToolbarMenuBlock from './EditorToolbarMenuBlock.vue'

import { VDivider } from 'vuetify/lib'

import printJS from 'print-js'

import { mapGetters } from 'vuex'

export default {

  name: 'EditorToolbar',

  components: {
    EditorToolbarButton, EditorToolbarMenuBlock, VDivider
  },

  props: {
    editor: {
      type: Object,
      default: null
    },
    minimal: {
      type: Boolean,
      default: false
    },
    show_changes: {
      type: Boolean,
      default: false
    },
    allow_comments: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapGetters([
      'doc'
    ]),

    editable: function() {
      return this.editor.isEditable();
    },
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
    },
    print_command: function() {
      return {
        icon: 'print',
        title: 'Print Assignment',
        isEnabled: () => true,
        isLatched: () => false,
        execute: () => {
          printJS({
            printable: 'prosemirror',
            type: 'html',
            header: this.doc.title,
            headerStyle: 'font-size: 24pt; font-weight: bold; font-family: Georgia,Helvetica,"Times New Roman",Times,serif;',
            css: '/styles/print.css'
          });
        }
      }
    }
  }

}

</script>

<template>

  <span v-if="editor" class="editor-toolbar">
    
    <EditorToolbarButton :command="print_command" />

    <template v-if="editable">

      <v-divider inset vertical />

      <EditorToolbarButton :command="commands.undo" />
      <EditorToolbarButton :command="commands.redo" />
  
      <template v-if="!minimal">
        <v-divider inset vertical />
        <EditorToolbarMenuBlock :commands="block_commands" /> 
      </template>

      <v-divider inset vertical />

      <EditorToolbarButton :command="commands.strong" />
      <EditorToolbarButton :command="commands.em" />

      <v-divider inset vertical />

      <EditorToolbarButton :command="commands.bullet_list" />
      <EditorToolbarButton :command="commands.ordered_list" />
      <EditorToolbarButton :command="commands.blockquote" />

      <v-divider inset vertical />

      <EditorToolbarButton v-if="!minimal" :command="commands.image" />
      <EditorToolbarButton :command="commands.link" />
    </template>

   
    <v-divider v-if="show_changes" inset vertical />
    <EditorToolbarButton v-if="show_changes" :command="commands.show_changes" />
      
    <v-divider v-if="allow_comments" inset vertical />
    <EditorToolbarButton v-if="allow_comments" :command="commands.comment" />
    
    
  </span>

</template>

<style>

.editor-toolbar .v-divider--vertical.v-divider--inset {
  height: 15px;
  margin: 0 5px;
}

</style>

