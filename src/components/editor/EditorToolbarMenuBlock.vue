


<script>

import MenuTile from '../core/MenuTile.vue'
import EditorToolbarMenu from './EditorToolbarMenu.vue'

export default {

  name: 'EditorToolbarMenuBlock',

  components: {
    MenuTile, EditorToolbarMenu
  },

  props: {
    commands: {
      type: Array,
      required: true
    }
  },

  computed: {
    title: function() {
      for (let i=0; i<this.commands.length; i++) {
        let command = this.commands[i];
        if (command.isLatched())
          return command.title;
      }
      return "Normal";
    }
  }

}

</script>

<template>

  <EditorToolbarMenu :title="title"> 
    <MenuTile 
      v-for="command in commands" 
      :key="command.name"
      :text="command.title"
      :icon="command.isLatched() ? 'check' : null"
      @clicked="command.execute()"
    />
  </EditorToolbarMenu>

</template>
