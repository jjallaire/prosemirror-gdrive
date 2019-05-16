


<script>

import AppPage from '../../../components/core/AppPage.vue'

export default {

  name: 'AssignmentsPage',

  components: {
    AppPage
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
    Page
  </AppPage>

</template>

<style>



</style>
