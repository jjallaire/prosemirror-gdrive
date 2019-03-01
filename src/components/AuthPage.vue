<script>


const gapi = window.gapi;

export default {
  name: 'AuthPage',

  methods: {

    auth() {
      return gapi.auth2.getAuthInstance();
    },

    onAuthorizeClicked() {
      this.auth().signIn();
    },
  }
}

</script>


<template>

  <div>

    <button @click="onAuthorizeClicked">Authorize</button>

  </div>

</template>