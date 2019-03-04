

<script>

import { VProgressCircular } from 'vuetify/lib'

export default {
  name: 'LoadingPage',

  components: {
    VProgressCircular
  }
}

</script>


<template>

  <div class="progress-container text-xs-center">

    <v-progress-circular
      :size="70"
      :width="7"
      color="orange"
      indeterminate
    />

  </div>

</template>

<style scoped>
.progress-container {
  margin-top: 200px;
  width: 100%;
}
</style>