
<script>

import EditorToolbar from './EditorToolbar'
import EditorLinkDialog from './dialogs/EditorLinkDialog.vue'
import EditorImageDialog from './dialogs/EditorImageDialog.vue'

import ProsemirrorEditor from '../../prosemirror'

export default {
  name: 'EditorComponent',

  components: {
    EditorToolbar, EditorLinkDialog, EditorImageDialog
  },

  data: function() {
    return {
      editor: null,
    }
  },

  mounted() {

    // initialize editor
    this.editor = new ProsemirrorEditor(this.$refs.prosemirror, {
      content: '',
      hooks: {
        onSelectionChanged: this.onEditorSelectionChanged,
        onEditLink: this.onEditLink,
        onEditImage: this.onEditImage
      }
    });
  },

  methods: {
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
        <EditorToolbar :editor="editor" />
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
  height: 100%;
  overflow-y: scroll;
}

</style>