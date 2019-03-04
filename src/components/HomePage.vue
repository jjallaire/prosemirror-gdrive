

<script>

import drive from '../drive'

import ProgressSpinner from './core/ProgressSpinner.vue'

// generic progress treatment for pages that load GDrive info


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

  <div v-if="files">

    <div v-for="file in files" :key="file.id">
      {{ file.name }} - {{ file.id }}
    </div>

  </div>

  <ProgressSpinner v-else />

</template>