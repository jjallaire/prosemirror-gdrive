<script>

import ErrorPanel from './ErrorPanel.vue'

export default {
  name: 'NotFoundPage',

  components: {
    ErrorPanel
  },

  computed: {
    page_url: function() {
      return window.location.href;
    }
  },
}

</script>

<template>

  <ErrorPanel title="404: Page Not Found" :message="page_url" />

</template>

<style>


</style>



