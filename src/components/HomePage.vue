

<script>


const gapi = window.gapi;

export default {
  name: 'HomePage',

  data: function() {
    return {
      files: []
    }
  },


  computed: {
    username: function() {
      let user = this.auth().currentUser.get();
      let profile = user.getBasicProfile();
      return profile.getEmail();
    },
  },

  mounted() {
    gapi.client.drive.files.list({
      pageSize: 10,
      fields: 'nextPageToken, files(id, name)'
    }).then(response => {
      if (response.result.files)
        this.files = response.result.files;
    });    

    let auth = this.auth();
    console.log(auth.currentUser.get());
  },
  

  methods: {

    auth() {
      return gapi.auth2.getAuthInstance();
    },

  }
}

</script>


<template>

  <div>

    <div v-for="file in files" :key="file.id">
      {{ file.name }} - {{ file.id }}
    </div>

  </div>

</template>