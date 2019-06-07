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
        this.editor.setContent(this.doc.description);
      },
      deep: true
    }
  },

  mounted() {
    this.editor = new ProsemirrorEditor(this.$refs.prosemirror, {
      content: '',
      autoFocus: false,
      hooks: {
        isEditable: () => false,
      }
    });
  },

  methods: {
   
  }

}

</script>

<template>

  <div ref="prosemirror" class="prosemirror-viewer" />

</template>

<style>

.prosemirror-viewer {
  width: 100%;
  height: 100%;
  background-color: white;
  padding: 8px;
}


</style>