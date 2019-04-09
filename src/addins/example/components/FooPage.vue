


<script>

import drive from '../../../drive'

import AppPage from '../../../components/core/AppPage.vue'

export default {

  name: 'FooPage',

  components: {
    AppPage
  },

  data: function() {
    return {
      files: []
    }
  },

  mounted() {
    // if the page requires async code to run before displaying, you can pass
    // a promise to page.intialize, e.g.
    this.$refs.page.initialize(
      drive.listFiles()
        .then(files => {
          this.files = files;
        })
    );
  }

}

</script>

<template>

  <AppPage ref="page">
    <div v-for="file in files" :key="file.id">
      {{ file.name }}
    </div>
  </AppPage>

</template>
