<script>

import { mapGetters } from 'vuex'

import ProsemirrorEditor from '../../prosemirror'

export default {
  name: 'AssignmentSidebar',

  data: function() {
    return {
      editor: null
    }
  },

  computed: {

    ...mapGetters([
      'doc'
    ]),

  },

  watch: {
    doc: {
      handler () {
        if (this.doc.id && !this.editor) {
          this.editor = new ProsemirrorEditor(
            this.$refs.prosemirror, 
            // options
            {
              content: this.doc.description,
              autoFocus: false,
            },
            // hooks
            {
              isEditable: () => false,
            }
          );
        }
      },
      deep: true
    }
  },
}

</script>

<template>

  <div ref="prosemirror" class="prosemirror-viewer" />

</template>

<style>

.prosemirror-viewer {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}


</style>