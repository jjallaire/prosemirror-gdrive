
<script>

import EditorToolbar from './EditorToolbar'
import EditorSaveStatus from './EditorSaveStatus'
import EditorLinkDialog from './dialogs/EditorLinkDialog.vue'
import EditorImageDialog from './dialogs/EditorImageDialog.vue'

import ProsemirrorEditor from '../../prosemirror'

export default {
  name: 'EditorComponent',

  components: {
    EditorToolbar, EditorSaveStatus, EditorLinkDialog, EditorImageDialog
  },

  props: {
    minimal_toolbar: {
      type: Boolean,
      default: false
    },
    save_status: {
      type: String,
      default: null
    }
  },

  data: function() {
    return {
      editor: null,
    }
  },


  beforeDestroy() {
    if (this.editor) {
      this.editor.destroy();
      this.editor = null;
    }
  },

  methods: {

    initialize({ content, onUpdate }) {
      this.editor = new ProsemirrorEditor(this.$refs.prosemirror, {
        content: content,
        hooks: {
          onUpdate: onUpdate,
          onSelectionChanged: this.onEditorSelectionChanged,
          onEditLink: this.onEditLink,
          onEditImage: this.onEditImage
        }
      })
    },

    onEditLink(link) {
      return this.$refs.linkDialog.show(link);
    },

    onEditImage(image) {
      return this.$refs.imageDialog.show(image);
    },

    onEditorSelectionChanged(selection) {
      if (selection.type === 'node') {
        this.$refs.prosemirror.classList.add("has-node-selection");
      } else {
        this.$refs.prosemirror.classList.remove("has-node-selection");
      }
    },
  }
}


</script>


<template>

  <div>
    <v-card class="card--flex-toolbar">
      
      <v-toolbar class="editor-component-toolbar" card dense :height="30">
        <EditorToolbar :editor="editor" :minimal="minimal_toolbar" />
        <v-spacer />
        <EditorSaveStatus v-if="save_status" :status="save_status" />
      </v-toolbar>
      
      <v-divider />

      <div ref="prosemirror" class="prosemirror-editor-component" />

    </v-card>

    <EditorLinkDialog ref="linkDialog" />
    <EditorImageDialog ref="imageDialog" />

  </div>

</template>

<style>

.editor-component-toolbar .v-toolbar__content {
  padding-left: 5px;
}

.prosemirror-editor-component {
  padding: 12px;
  position: absolute;
  top: 29px;
  left: 0;
  bottom: 0;
  right: 0;
  overflow-y: scroll;
}

</style>