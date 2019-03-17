<script>

export default {

  name: 'EditorSaveStatus',

  props: {
    status: {
      type: String,
      required: true
    }
  },

  computed: {
    status_display: function() {
      switch(this.status) {
        case 'clean':
          return "";
        case 'dirty':
          return "Saving...";
        case 'saved':
          return "Saved";
        default:
          return "";
      }
    }
  },
}

</script>

<template>

  <span class="editor-save-status">
    {{ status_display }}
  </span>

</template>

<style>

.editor-save-status {
  color: rgba(0,0,0,0.4);
}

</style>