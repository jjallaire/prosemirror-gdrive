
<script>

import { VProgressCircular } from 'vuetify/lib'

export default {
  name: 'ProgressSpinner',

  components: {
    VProgressCircular
  }
}

</script>

<template>
  
  <div class="progress-spinner text-xs-center">

    <div class="progress-glass" />

    <v-progress-circular
      :size="70"
      :width="7"
      color="orange"
      indeterminate
    />

  </div>

</template>

<style>
.progress-spinner {
  width: 100%;
  padding-bottom: 200px;
}

.progress-spinner .progress-glass {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 1000;
  opacity: 0.5;
}
</style>

