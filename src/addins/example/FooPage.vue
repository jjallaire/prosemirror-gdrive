


<script>

import AppPage from '../../components/core/AppPage.vue'

export default {

  name: 'FooPage',

  components: {
    AppPage
  },

  mounted() {
    this.$refs.page.initialize(
      new Promise(resolve => {
        setTimeout(() => resolve(), 5000);
      })
    );
  }

}

</script>

<template>

  <AppPage ref="page">
    Foo Page
  </AppPage>

</template>
