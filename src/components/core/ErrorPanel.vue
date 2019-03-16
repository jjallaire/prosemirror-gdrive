<script>

import { VAlert } from 'vuetify/lib'

export default {
  name: 'ErrorPanel',

  components: {
    VAlert
  },

  props: {
    error: {
      type: Error,
      default: null
    },
    title: {
      type: String,
      default: null
    },
    message: {
      type: String,
      default: null
    },
    diagnostics: {
      type: String,
      default: null
    }
  },

  computed: {
    display_title: function() {
      if (this.error) {
        return this.error.name;
      } else {
        return this.title;
      }
    },

    display_message: function() {
      if (this.error) {
        return this.error.message;
      } else {
        return this.message;
      }
    },

    display_diagnostics: function() {
      if (this.error && this.error.name === "GAPIError")
        return "domain=" + this.error.domain + ", reason=" + this.error.reason;
      else
        return this.diagnostics;
    }
  }
 
}

</script>

<template>

  <div class="error-container text-xs-center">

    <v-alert
      :value="true"
      color="error"
      icon="warning"
      outline
    >
      <h1>{{ display_title }}</h1>
      <p>
        {{ display_message }}
      </p>
      <p v-if="display_diagnostics">
        <small>{{ display_diagnostics }}</small>
      </p>
    </v-alert>

  </div>
  
</template>

<style>

.error-container {
  width: 100%;
  padding-left: 150px;
  padding-right: 150px;
}

.error-container h1 {
  margin-bottom: 15px;
}

</style>
