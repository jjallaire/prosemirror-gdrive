

<script>

import { VBtn, VIcon, VDivider } from 'vuetify/lib'

import { EditorMenuBar } from 'tiptap'

import EditorSaveStatus from './EditorSaveStatus.vue'

export default {

  name: 'EditorToolbar',

  components: {
    VBtn, VIcon, VDivider, EditorMenuBar, EditorSaveStatus
  },

  props: {
    editor: {
      type: Object,
      default: null
    },
    editor_updates: {
      type: Object,
      required: true
    }
  },

}


</script>

<template>

  <editor-menu-bar :editor="editor">

    <span slot-scope="{ commands, isActive }" class="editor-toolbar">
      
      <v-btn flat title="Undo" @click="commands.undo">
        <v-icon>undo</v-icon>
      </v-btn>

      <v-btn flat title="Redo" @click="commands.redo">
        <v-icon>redo</v-icon>
      </v-btn>
      
      <v-divider inset vertical />

      <v-btn flat title="Bold" :class="{ 'v-btn--active': isActive.bold() }" @click="commands.bold">
        <v-icon>format_bold</v-icon>
      </v-btn>

      <v-btn flat title="Italic" :class="{ 'v-btn--active': isActive.italic() }" @click="commands.italic">
        <v-icon>format_italic</v-icon>
      </v-btn>

      <v-btn flat title="Underline" :class="{ 'v-btn--active': isActive.underline() }" @click="commands.underline">
        <v-icon>format_underline</v-icon>
      </v-btn>

      <v-btn flat title="Strikethrough" :class="{ 'v-btn--active': isActive.strike() }" @click="commands.strike">
        <v-icon>format_strikethrough</v-icon>
      </v-btn>

      <v-btn flat title="Code" :class="{ 'v-btn--active': isActive.code() }" @click="commands.code">
        <v-icon>code</v-icon>
      </v-btn>

      <v-divider inset vertical />

      <v-btn flat title="Bullet list" :class="{ 'v-btn--active': isActive.bullet_list() }" @click="commands.bullet_list">
        <v-icon>list</v-icon>
      </v-btn>

      <v-btn flat title="Numbered list" :class="{ 'v-btn--active': isActive.ordered_list() }" @click="commands.ordered_list">
        <v-icon>format_list_numbered</v-icon>
      </v-btn>

      <v-btn flat title="Blockquote" :class="{ 'v-btn--active': isActive.blockquote() }" @click="commands.blockquote">
        <v-icon>format_quote</v-icon>
      </v-btn>

      <v-divider inset vertical />

      <EditorSaveStatus :editor_updates="editor_updates" />
      
    </span>

  </editor-menu-bar>

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

.editor-toolbar .editor-save-status {
  margin-left: 5px;
}


</style>

