

<script>


import { mapGetters } from 'vuex'

import { VDataTable } from 'vuetify/lib'

import drive from '../drive'

export default {
  name: 'HomePage',

  components: {
    VDataTable
  },

  data: function() {
    return {
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'ID', value: 'id' }
      ]
    }
  },

  computed: {
    ...mapGetters([
      'recent_files'
    ])
  },

  mounted() {
    drive.updateRecentFiles();
  },
  
  methods: {

  }
}

</script>


<template>

  <div class="home-container">

    <div class="recent-documents">

      <v-data-table 
        :headers="headers"
        :items="recent_files"
        item-key="id"
        :rows-per-page-items="[50,100,{'text':'$vuetify.dataIterator.rowsPerPageAll','value':-1}]"
        class="elevation-1"
      >
        <template v-slot:items="props">
          <td><router-link :to="'/edit/' + props.item.id">{{ props.item.name }}</router-link></td>
          <td>{{ props.item.id }}</td>
        </template>
      </v-data-table>
    </div>
  </div>

</template>

<style>
.home-container {
  width: 100%;
  height: 100%;
}

.home-container .recent-documents {
  height: 100%;
}

</style>