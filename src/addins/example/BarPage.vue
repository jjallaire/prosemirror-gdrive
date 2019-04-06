


<script>

import AppPage from '../../components/core/AppPage.vue'

export default {

  name: 'BarPage',

  components: {
    AppPage
  },

  mounted() {
    this.$refs.page.initialize();
  }

}

</script>

<template>

  <AppPage ref="page">
    Bar Page 
  </AppPage>

</template>
