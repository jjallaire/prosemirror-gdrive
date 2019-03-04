<script>


import drive from '../drive'

export default {
  name: 'AuthPage',

  methods: {


    onAuthorizeClicked() {
      drive.signIn();
    },
  }
}

</script>


<template>

  <div class="home-container text-xs-center">

    <p class="display-2">Welcome to ProseMirror GDrive</p>

    <p class="body-2">
      To continue, please sign in using your Google Account.
    </p>

    <button class="google-sign-in" @click="onAuthorizeClicked" />
   


  </div>

</template>

<style>

.home-container { 
  margin-top: 100px;
  width: 100%;
}

.home-container .display-2 {
  margin-bottom: 50px;
}

.google-sign-in {
  margin-top: 10px;
  background-image: url('/images/sign-in-with-google.png');
  background-size: 191px 46px;
  width: 191px;
  height: 46px;
}


</style>