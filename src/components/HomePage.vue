

<script>

import DocumentListing from './navigation/DocumentListing.vue'

export default {
  name: 'HomePage',

  components: {
    DocumentListing
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

}

</style>