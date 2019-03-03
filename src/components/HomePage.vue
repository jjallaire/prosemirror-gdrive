

<script>

import drive from '../drive'



export default {
  name: 'HomePage',

  data: function() {
    return {
      files: []
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

  <div>

    <div v-for="file in files" :key="file.id">
      {{ file.name }} - {{ file.id }}
    </div>

  </div>

</template>