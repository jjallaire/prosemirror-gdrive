<script>

import ErrorDisplay from './ErrorDisplay.vue'

export default {
  name: 'NotFoundPage',

  components: {
    ErrorDisplay
  },

  computed: {
    page_url: function() {
      return window.location.href;
    }
  },
}

</script>

<template>

  <ErrorDisplay title="404: Page Not Found" :message="page_url" />

</template>

<style>


</style>



