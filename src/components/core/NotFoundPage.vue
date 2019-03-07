<script>

import ErrorPage from './ErrorPage.vue'

export default {
  name: 'NotFoundPage',

  components: {
    ErrorPage
  },

  computed: {
    page_url: function() {
      return window.location.href;
    }
  },
}

</script>

<template>

  <ErrorPage title="404: Page Not Found" :message="page_url" />

</template>

<style>


</style>



