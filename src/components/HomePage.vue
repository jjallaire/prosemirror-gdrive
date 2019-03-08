

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
        { text: '', value: 'icon', sortable: false, width: '3%' },
        { text: 'Name', value: 'name' },
        { text: 'Owner', value: 'owner' },
        { text: 'Last modified', value: 'modifiedTime' },
        { text: 'File size', value: 'size' }
      ],
      pagination_sync: {
        sortBy: 'modifiedTime',
        descending: true
      }
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
        :pagination.sync="pagination_sync"
        :rows-per-page-items="[50,100,{'text':'$vuetify.dataIterator.rowsPerPageAll','value':-1}]"
        no-data-text="No recent documents"
        class="elevation-1"
      >
        <template v-slot:items="props">
          <td><img :src="props.item.icon"></td>
          <td><router-link :to="'/edit/' + props.item.id">{{ props.item.name }}</router-link></td>
          <td>{{ props.item.owner }}</td>
          <td>{{ new Date(props.item.modifiedTime).toLocaleTimeString() }}</td>
          <td>{{ props.item.size | bytes }}</td>
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