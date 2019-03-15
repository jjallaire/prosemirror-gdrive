<script>

export default {

  name: 'EditorSaveStatus',

  props: {
    editor_updates: {
      type: Object,
      required: true
    }
  },

  computed: {
    save_status: function() {
      if (this.editor_updates.last === null) {
        return "clean";
      } else if (this.editor_updates.last_save_time === null ||
               this.editor_updates.last.transaction.time > this.editor_updates.last_save_time) {
        return "dirty";      
      } else {
        return "saved";
      }
    },
    save_status_display: function() {
      switch(this.save_status) {
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
    {{ save_status_display }}
  </span>

</template>

<style>

.editor-save-status {
  color: rgba(0,0,0,0.4);
}

</style>