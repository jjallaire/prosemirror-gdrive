


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

  <AppPage ref="page">
    Page
  </AppPage>

</template>

<style>



</style>
