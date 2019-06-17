<script>

import EditorActionDialog from './EditorActionDialog.vue'

import { VBtn, VIcon } from 'vuetify/lib'

import { mapGetters } from 'vuex'

export default {
  name: 'EditorActionButton',

  components: {
    VBtn, VIcon, EditorActionDialog
  },

  data: function() {
    return {
      icon: null,
      caption: null,
      prompt: null,
      status: null,
      enter_grade: false,
      color: 'success'
    }
  },

  computed: {
    ...mapGetters([
      'doc'
    ])
  },

  methods: {
    onClicked() {
      this.$refs.dialog.show(
        this.doc.id,
        this.status,
        this.caption,
        this.prompt,
        this.enter_grade,
        this.doc.properties.grade
      )
    }
  }
}

</script>

<template>

  <v-btn class="editor-action-button" depressed small :color="color" @click="onClicked">
    <v-icon v-if="icon" small light>{{ icon }}</v-icon>
    &nbsp;
    {{ caption }}
    <EditorActionDialog ref="dialog" />
  </v-btn>

</template>

<style>

</style>
