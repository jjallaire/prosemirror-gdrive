<script>


import config from '../../config'

import drive from '../../drive'

export default {
  name: 'AuthPage',

  computed: {
    app_title: function() {
      return config.app.title;
    }
  },

  methods: {


    onAuthorizeClicked() {
      drive.signIn();
    },
  }
}

</script>


<template>

  <div class="auth-container text-xs-center">

    <p class="display-2">Welcome to {{ app_title }}</p>

    <p class="body-2">
      To continue, please sign in using your Google Account.
    </p>

    <button class="google-sign-in" @click="onAuthorizeClicked" />
   


  </div>

</template>

<style>

.auth-container { 
  width: 100%;
  padding-top: 200px;
}

.auth-container .display-2 {
  margin-bottom: 50px;
}

.auth-container .google-sign-in {
  margin-top: 10px;
  background-image: url('/images/sign-in-with-google.png');
  background-size: 191px 46px;
  width: 191px;
  height: 46px;
}


</style>