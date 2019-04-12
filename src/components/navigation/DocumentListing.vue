
<script>

import _debounce from 'lodash/debounce'

import { VDataTable } from 'vuetify/lib'
import PopupMenu from '../core/PopupMenu'
import MenuTile from '../core/MenuTile'

import drive from '../../drive'
import driveChanges from '../../drive/changes'
import dialog from '../core/dialog'
import { newDocument, openDocument } from '../core/docs'

export default {
  name: 'DocumentListing',

  components: {
    VDataTable, PopupMenu, MenuTile
  },

  data: function() {
    return {
      headers: [
        { text: 'Type', value: 'icon', sortable: false, width: '5%' },
        { text: 'Name', value: 'name' },
        { text: 'Owner', value: 'owner', sortable: false},
        { text: 'Last viewed', value: 'lastViewed' },
        { text: 'File size', value: 'size' },
        { text: 'Actions', sortable: false , width: '5%'}
      ],
      pagination: {
        sortBy: 'lastViewed',
        descending: true,
        rowsPerPage: 50,
        rowsPerPageItems: [50,100,250]
      },
      search: '',
      loading: true,
      items: []
    }
  },

  watch: {
    pagination: {
      handler () {
        // re-query data for page 1
        if (this.pagination.page === 1)
          this.updateItems(true);
      },
      deep: true
    }
  },

  mounted() {
    driveChanges.subscribe(this.updateItems);
  },

  beforeDestroy() {
    driveChanges.unsubscribe(this.updateItems)
  },

  methods: {

    updateItems(clear = false) {
      if (clear)
        this.items = [];
      this.loading = true;
      drive
        .listFiles({
          orderBy: this.pagination.sortBy,
          descending: this.pagination.descending, 
          search: this.search
        })
        .then(files => {
          this.items = files;
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          dialog.error("Drive Error", error.message);
        });
    },

    onNewDocument() {
      newDocument();
    },

    onOpenDocument() {
      openDocument()
    },


    onSearchChanged: _debounce(function() { 
      if (this.search)
        this.pagination.sortBy = '';
      else
        this.pagination.sortBy = 'lastViewed';
      this.updateItems();
    }, 500),

    
    onDocumentClicked(doc) {
      this.$router.push({ path: "/edit/" + doc.id });
    },

    onRemoveDocument(doc) {
      dialog
        .confirm ('Remove Document', 'Are you sure you want to remove this document?')
        .then(confirmed => {
          if (confirmed)
            this.handleDriveRequest(drive.removeFile(doc.id));
        });
    },

    onRenameDocument(doc) {
      dialog
        .prompt('Rename Document', 'New name for document:')
        .then(title => {
          if (title)
            this.handleDriveRequest(drive.renameFile(doc.id, title));
        });
    },

    onShareDocument(doc) {
      drive.shareFileDialog(doc.id);
    },

    onOpenInNewTab(doc) {
      window.open("/edit/" + doc.id, "_blank");
    },

    handleDriveRequest(request) {
      request
        .then(() => {
          this.updateItems();
          drive.updateRecentDocs();
        })
        .catch(error => {
          dialog.error("Drive Error", error.message);
        });
    }

  },

}

</script>


<template>

  <div class="recent-documents">

    <v-card>
      <v-card-title>
       
        <v-btn title="Create new document" color="orange" fab dark small @click="onNewDocument">
          <v-icon>add</v-icon>
        </v-btn>

        <v-btn title="Open file picker" color="orange" fab outline dark small @click="onOpenDocument">
          <v-icon>folder_open</v-icon>
        </v-btn>
      
        <v-spacer />
        <v-spacer />
        <v-spacer />
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Search"
          single-line
          hide-details
          clearable
          @input="onSearchChanged"
        />
      </v-card-title>

      <v-data-table 
        :must-sort="!search"
        :headers="headers"
        :items="items"
        :loading="loading"
        item-key="id"
        :pagination.sync="pagination"
        :rows-per-page-items="pagination.rowsPerPageItems"
        no-data-text="(No documents found)"
        class="documents-table"
      >

        <template v-slot:no-data>
          <div class="table-status text-xs-center grey--text">
            <span v-if="loading">Loading...</span>
            <span v-else>(No documents)</span>
          </div>
        </template>

        <template v-slot:no-results>
          <div class="table-status text-xs-center grey--text">
            (No documents found)
          </div>
        </template>

        <template v-slot:items="props">
          <tr class="table-row">
            <td @click="onDocumentClicked(props.item)"><img :src="props.item.icon"></td>
            <td class="table-doc-name" @click="onDocumentClicked(props.item)">
              {{ props.item.name }}
              <v-icon v-if="props.item.shared" title="Shared" small>people</v-icon>
            </td>
            <td @click="onDocumentClicked(props.item)">{{ props.item.owner }}</td>
            <td @click="onDocumentClicked(props.item)">{{ new Date(props.item.lastViewed).toDateString() }}</td>
            <td @click="onDocumentClicked(props.item)">{{ props.item.size | bytes }}</td>
            <td align="center">
              <PopupMenu>
                <MenuTile icon="text_fields" text="Rename..." @clicked="onRenameDocument(props.item)" />
                <MenuTile icon="delete" text="Remove..." @clicked="onRemoveDocument(props.item)" />
                <MenuTile icon="people" text="Share..." @clicked="onShareDocument(props.item)" />
                <MenuTile icon="open_in_new" text="Open in new tab" @clicked="onOpenInNewTab(props.item)" />
              </PopupMenu>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </div>

</template>

<style>


.recent-documents td > a {
  text-decoration: none;
}

.recent-documents .v-card__title {
  padding-left: 8px;
}

.recent-documents .table-status {
  padding-top: 70px;
  padding-bottom: 80px;
}

.recent-documents .table-doc-name {
  font-weight: 500;
}

.recent-documents .table-doc-name i {
  margin-left: 10px;
}

.recent-documents .table-row {
  cursor: pointer;
}

.recent-documents .table-row i {
   color: rgba(0,0,0,0.54) !important;
}

</style>