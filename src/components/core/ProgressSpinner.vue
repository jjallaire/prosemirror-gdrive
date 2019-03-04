
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

    <v-progress-circular
      :size="70"
      :width="7"
      color="orange"
      indeterminate
    />

  </div>

</template>

<style scoped>
.progress-spinner {
  margin-top: 200px;
  width: 100%;
}
</style>

