<script>

export default {
  name: 'EditorSidebar',

  data: function() {
    return {
      panes: [
        {
          text: 'Comments',
          value: 'comments'
        }
      ]
    }
  }

}


</script>

<template>

  <div id="prosemirror-sidebar">
    <v-select :items="panes" solo flat value="comments" />
  </div>

</template>

<style>

#prosemirror-sidebar .v-input__slot {
  color: rgba(0,0,0,0.87);
  background-color: #f5f5f5;
  border-bottom: 1px solid rgba(0,0,0,0.12)
}

#prosemirror-sidebar .v-select__selection {
  font-size: 0.9em;
}

#prosemirror-sidebar .v-text-field.v-text-field--solo .v-input__control {
  min-height: 0;
}

</style>