

<script>

import drive from '../drive'

import ProgressSpinner from './core/ProgressSpinner.vue'

export default {
  name: 'HomePage',

  components: {
    ProgressSpinner
  },

  data: function() {
    return {
      files: null
    }
  },

  mounted() {
    drive.listFiles().then(files => {
      this.files = files;
    })
  },
  
  methods: {

  }
}

</script>


<template>

  <div class="home-container">
    <div v-if="files">

      <div v-for="file in files" :key="file.id">
        {{ file.name }} - {{ file.id }}
      </div>

    </div>

    <ProgressSpinner v-else />

  </div>

</template>

<style>
.home-container {
  width: 100%;
}
</style>