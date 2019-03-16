

<script>

import DocumentListing from './navigation/DocumentListing.vue'
import { newDocument } from './core/docs'

export default {
  name: 'HomePage',

  components: {
    DocumentListing
  },

  mounted() {
    if (this.$route.query.hasOwnProperty('newDoc'))
      newDocument();  
  }
}

</script>


<template>

  <div class="home-container">
    <DocumentListing />
  </div>

</template>

<style>
.home-container {
  width: 100%;
  height: 100%;
}

</style>