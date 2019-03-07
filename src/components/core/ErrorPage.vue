<script>

import { mapGetters } from 'vuex'

export default {
  name: 'ErrorPage',

  computed: {
    ...mapGetters([
      'init_error'
    ]),
  },

  methods: {


  }
}

</script>


<template>

  <div class="error-container">

    {{ init_error.message }}

  </div>

</template>

<style>

.help-container { 
  width: 100%;
  height: 100%;
}

</style>