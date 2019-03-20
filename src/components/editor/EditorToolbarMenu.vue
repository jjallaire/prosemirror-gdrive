

<script>

export default {

  name: 'EditorToolbarMenu',

  props: {
    title: {
      type: String,
      required: true
    }
  }



}

</script>


<template>

  <v-menu class="editor-toolbar-menu" bottom left nudge-left>
    <template v-slot:activator="{ on }">
      <v-btn 
        class="editor-toolbar-menu-button" 
        v-on="on"
      >
        {{ title }}
        <v-icon>arrow_drop_down</v-icon>
      </v-btn>
    </template>
    <v-list class="editor-toolbar-menu-items" dense>
      <slot />
    </v-list>
  </v-menu>

</template>


<style>

.editor-toolbar-menu {
  display: inline-flex;
}

.editor-toolbar-menu-button {
  box-shadow: none !important;
  text-transform: none;
  font-weight: inherit;
  min-width: 0;
  height: auto;
  padding: 0 8px;
  padding-right: 3px;
  margin: 0 0;
}

.editor-toolbar-menu-items .v-list__tile {
  padding-left: 0;
  padding-right: 30px;
  height: 30px;
}

.editor-toolbar-menu-items .v-list__tile__avatar {
  min-width: 40px;
  height: 30px;
}

</style>

