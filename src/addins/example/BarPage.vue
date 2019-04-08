


<script>

import AppPage from '../../components/core/AppPage.vue'

export default {

  name: 'BarPage',

  components: {
    AppPage
  },

  mounted() {
    // any initialization code goes here

    // note that if the initialization code is async, see the FooPage
    // example for how to handle that scenario

    this.$refs.page.initialize();
  }

}

</script>

<template>

  <AppPage ref="page">
    Bar Page 
  </AppPage>

</template>
