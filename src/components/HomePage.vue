

<script>

import RecentDocuments from './navigation/RecentDocuments.vue'

export default {
  name: 'HomePage',

  components: {
    RecentDocuments
  } 
}

</script>


<template>

  <div class="home-container">
    <RecentDocuments />
  </div>

</template>

<style>
.home-container {
  width: 100%;

}

</style>