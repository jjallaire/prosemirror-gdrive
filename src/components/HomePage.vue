

<script>


const gapi = window.gapi;

export default {
  name: 'HomePage',

  data: function() {
    return {
      files: []
    }
  },


  mounted() {
    gapi.client.drive.files.list({
      pageSize: 10,
      fields: 'nextPageToken, files(id, name)'
    }).then(response => {
      if (response.result.files)
        this.files = response.result.files;
    });    
  },
  
  methods: {

    auth() {
      return gapi.auth2.getAuthInstance();
    },

    onSignOutClicked() {
      this.auth().signOut();
    },
  }
}

</script>


<template>

  <div>
  
    <button @click="onSignOutClicked">Sign Out</button>
    
    <hr>
    <p />

    <div v-for="file in files" :key="file.id">
      {{ file.name }} - {{ file.id }}
    </div>

  </div>

</template>