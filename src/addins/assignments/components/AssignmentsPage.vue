


<script>

import AppPage from '../../../components/core/AppPage.vue'

import EditorComponent from '../../../components/editor/EditorComponent'

export default {

  name: 'AssignmentsPage',

  components: {
    AppPage, EditorComponent
  },

  data: function() {
    return {
     
    }
  },

  mounted() {
    this.$refs.page.initialize();
  }

}

</script>

<template>

  <AppPage ref="page">
    <EditorComponent ref="editor" class="assignment-editor" />
  </AppPage>

</template>

<style>

.assignment-editor {
  height: 400px;
  width: 50%;
}

.assignment-editor .v-card {
  height: 100%;
}

</style>
