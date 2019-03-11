
<script>

import { mapGetters } from 'vuex'

import { VDataTable } from 'vuetify/lib'
import MenuTile from '../core/MenuTile'

import drive from '../../drive'
import * as utils from '../core/utils'

export default {
  name: 'RecentDocuments',

  components: {
    VDataTable, MenuTile
  },

  data: function() {
    return {
      headers: [
        { text: '', value: 'icon', sortable: false, width: '5%' },
        { text: 'Name', value: 'name' },
        { text: 'Owner', value: 'owner' },
        { text: 'Last viewed', value: 'lastViewed' },
        { text: 'File size', value: 'size' },
        { text: 'Actions', sortable: false , width: '5%'}
      ],
      pagination_sync: {
        sortBy: 'lastViewed',
        descending: true
      }
    }
  },

  computed: {
    ...mapGetters([
      'recent_docs',
      'settings'
    ])
  },

  mounted() {
    drive.updateRecentDocs();
  },
  
  methods: {
    onNewDocument() {
      this.$router.push({ path: "/edit/" });
    },

    onDocumentClicked(doc) {
      this.$router.push({ path: "/edit/" + doc.id });
    },

    onRemoveDocument(doc) {
      this.$dialog.confirm ({
        text: 'Are you sure you want to remove this document?',
        title: 'Remove Document',
      }).then(confirmed => {
        if (confirmed)
          this.handleDriveRequest(drive.removeFile(doc.id));
      });
    },

    onRenameDocument(doc) {
      this.$dialog.prompt({
        text: 'New name for document:',
        title: 'Rename Document'
      })
      .then(title => {
        if (title)
          this.handleDriveRequest(drive.renameFile(doc.id, title));
      });
      utils.focusDialogTitle();
    },

    onShareDocument(doc) {
      drive.shareFile(doc.id);
    },

    onOpenInNewTab(doc) {
      window.open("/edit/" + doc.id, "_blank");
    },

    handleDriveRequest(request) {
      request
        .then(() => {
          drive.updateRecentDocs();
        })
        .catch(error => {
          this.$dialog.error({
            text: error.message,
            title: "Drive Error"
          })
        });
    }

  },

}

</script>


<template>

  <div class="recent-documents">

    <div class="add-button">
      <v-btn title="Create new document" color="orange" dark fab small @click="onNewDocument">
        <v-icon>add</v-icon>
      </v-btn>
    </div>

    <v-data-table 
      :headers="headers"
      :items="recent_docs"
      item-key="id"
      :pagination.sync="pagination_sync"
      :rows-per-page-items="[settings.document_history]"
      :hide-actions="true"
      class="elevation-1"
    >
      <template v-slot:no-data>
        <div class="table-status text-xs-center grey--text">
          (No documents)
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
            <v-menu bottom left nudge-left>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  v-on="on"
                >
                  <v-icon>more_vert</v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <MenuTile icon="text_fields" text="Rename..." @clicked="onRenameDocument(props.item)" />
                <MenuTile icon="delete" text="Remove..." @clicked="onRemoveDocument(props.item)" />
                <MenuTile icon="people" text="Share..." @clicked="onShareDocument(props.item)" />
                <MenuTile icon="open_in_new" text="Open in new tab" @clicked="onOpenInNewTab(props.item)" />
              </v-list>
            </v-menu>
          </td>
        </tr>
      </template>
    </v-data-table>
  
  </div>

</template>

<style>

.recent-documents .add-button {
  margin-bottom: -27px;
  margin-left: 4px;
}

.recent-documents td > a {
  text-decoration: none;
}

.recent-documents .table-status {
  padding-top: 70px;
  padding-bottom: 70px;
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

</style>