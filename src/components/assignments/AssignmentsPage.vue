




<script>

import AppPage from '../core/AppPage.vue'

import config from '../../config'

import DocumentListing from '../navigation/DocumentListing.vue'

export default {

  name: 'AssignmentsPage',

  components: {
    AppPage, DocumentListing
  },

  data: function() {
    return {
      mimeType: config.gdrive.assignmentMimeType
    }
  },

  mounted() {
    this.$refs.page.initialize();
  }

}

</script>

<template>

  <AppPage ref="page" title="Assignments">
    <DocumentListing :mime_type="mimeType" edit_path="/assignment/" />
  </AppPage>

</template>

<style>



</style>
