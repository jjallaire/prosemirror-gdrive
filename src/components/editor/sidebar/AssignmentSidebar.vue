<script>

import { mapGetters } from 'vuex'

import drive from '../../../drive'
import dialog from '../../core/dialog'

import ProsemirrorEditor from '../../../prosemirror'

export default {
  name: 'AssignmentSidebar',

  data: function() {
    return {
      editor: null
    }
  },

  computed: {

    ...mapGetters([
      'doc',
      'user'
    ]),

  },

  watch: {
    doc: {
      handler () {
        this.loadAssignment();
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
    loadAssignment() {

      drive
        .getFile(this.doc.id)
        .then(assignment => {
          this.editor.setContent(JSON.parse(assignment.content).description);
        })
        .catch(error => {
          dialog.errorSnackbar(
            "Unable to load assignment (" + error.message + ")."
          );
        })

    }
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