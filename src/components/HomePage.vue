

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
        { text: '', value: 'icon', sortable: false, width: '5%' },
        { text: 'Name', value: 'name' },
        { text: 'Owner', value: 'owner' },
        { text: 'Last modified', value: 'modifiedTime' },
        { text: 'File size', value: 'size' },
        { text: 'Actions', sortable: false , width: '5%'}
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
    onNewDocument() {
      this.$router.push({ path: "/edit/" });
    },

    onRemoveDocument(doc) {
      this.$dialog.confirm ({
        text: 'Are you sure you want to remove this document?',
        title: 'Remove Document',
      }).then(confirmed => {
        if (confirmed) {
          drive.removeFile(doc.id)
            .then(() => {
              drive.updateRecentFiles();
            })
            .catch(error => {
              this.$dialog.error({
                text: error.message,
                title: "Error Removing Document"
              })
            });
        }
      });
    }
  }
}

</script>


<template>

  <div class="home-container">

    <div class="recent-documents">

      <div class="add-button">
        <v-btn dark fab small color="primary" @click="onNewDocument">
          <v-icon>add</v-icon>
        </v-btn>
      </div>

      <v-data-table 
        :headers="headers"
        :items="recent_files"
        item-key="id"
        :pagination.sync="pagination_sync"
        :rows-per-page-items="[25, 50, 100]"
        rows-per-page-text="Recent documents:"
        no-data-text="No recent documents"
        :hide-actions="true"
        :total-items="100"
        class="elevation-1"
      >
        <template v-slot:items="props">
          <td><img :src="props.item.icon"></td>
          <td><router-link :to="'/edit/' + props.item.id">{{ props.item.name }}</router-link></td>
          <td>{{ props.item.owner }}</td>
          <td>{{ new Date(props.item.modifiedTime).toLocaleTimeString() }}</td>
          <td>{{ props.item.size | bytes }}</td>
          <td align="center">
            <v-icon small @click="onRemoveDocument(props.item)">delete</v-icon>
          </td>
        </template>
      </v-data-table>
    </div>
  </div>

</template>

<style>
.home-container {
  width: 100%;

}

.home-container .recent-documents .add-button {
  margin-bottom: -27px;
  margin-left: 4px;
}

.home-container .recent-documents td > a {
  text-decoration: none;
}


</style>