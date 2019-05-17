




<script>

import AppPage from '../../../components/core/AppPage.vue'

import DocumentListing from '../../../components/navigation/DocumentListing.vue'

export default {

  name: 'AssignmentsPage',

  components: {
    AppPage, DocumentListing
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

  <AppPage ref="page" title="Assignments">
    <DocumentListing mime_type="application/vnd.google.drive.ext-type.pmasn" edit_path="/assignment/" />
  </AppPage>

</template>

<style>



</style>
