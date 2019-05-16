

<script>

import ErrorPanel from './ErrorPanel.vue'
import ProgressSpinner from './ProgressSpinner.vue'

import { SET_PAGE_TITLE } from '../../store/mutations'

export default {
  name: 'AppPage',

  components: {
    ErrorPanel, ProgressSpinner
  },

  props: {
    title: {
      type: String,
      default: null
    }
  },

  data: function() {
    return {
      error: null,
      initialized: false
    }
  },

  mounted() {
    if (this.title)
      this.$store.commit( SET_PAGE_TITLE, this.title);
  },

  beforeDestroy() {
    this.$store.commit( SET_PAGE_TITLE, null);
  },

  methods: {
    initialize(promise) {
      if (!promise) {
        this.initialized = true;
        return Promise.resolve();
      }
      else {
        return promise
          .then(() => {
            this.initialized = true;
          })
          .catch(error => {
            this.error = error;
          })
      }
    }
  }
}

</script>


<template>

  <div class="page-container">
    <div v-if="error">
      <ErrorPanel :error="error" />
    </div>
    <div v-else-if="initialized">
      <slot />
    </div>
    <div v-else>
      <ProgressSpinner />
    </div>

  </div>

</template>

<style>
.page-container {
  width: 100%;
  height: 100%;
}
</style>
