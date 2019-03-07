

<script>


import { mapGetters } from 'vuex'

import { VDataTable, VCheckbox } from 'vuetify/lib'

import drive from '../drive'

export default {
  name: 'HomePage',

  components: {
    VDataTable, VCheckbox
  },

  data: function() {
    return {
      headers: [
        { 
          text: '', value: 'selected', sortable: false
        },
        {
          text: 'Name', value: 'name'
        },
        {
          text: 'ID', value: 'id'
        }
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
        :rows-per-page-items="[10,20,30,50,{'text':'$vuetify.dataIterator.rowsPerPageAll','value':-1}]"
        class="elevation-1"
      >
        <template v-slot:items="props">
          <td>
            <v-checkbox
              :input-value="props.selected"
              primary
              hide-details
            />
          </td>
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