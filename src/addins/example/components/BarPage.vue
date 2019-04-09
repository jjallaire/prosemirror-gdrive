


<script>

import AppPage from '../../../components/core/AppPage.vue'

import store, { SET_NAME } from '../store'

import { VTextField } from 'vuetify/lib'

export default {

  name: 'BarPage',

  components: {
    AppPage, VTextField
  },

  computed: {
    name: {
      get() {
        return store.state.name;
      },
      set(value) {
        store.commit(SET_NAME, value)
      }
    }
  },

   mounted() {
    // any initialization code goes here

    // note that if the initialization code is async, see the FooPage
    // example for how to handle that scenario

    this.$refs.page.initialize();
  },


}

</script>

<template>

  <AppPage ref="page">
    
    Bar Page 

    <p>
      <v-text-field v-model="name" placeholder="Name" />
    </p>

  </AppPage>

</template>
