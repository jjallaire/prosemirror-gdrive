

<script>


import { mapGetters } from 'vuex'

export default {
  name: 'HomePage',

  computed: {
    ...mapGetters([
      'recent_files'
    ])
  },
  
  methods: {

  }
}

</script>


<template>

  <div class="home-container">
    <div v-for="file in recent_files" :key="file.id">
      {{ file.name }} - {{ file.id }}
    </div>
  </div>

</template>

<style>
.home-container {
  width: 100%;
}
</style>