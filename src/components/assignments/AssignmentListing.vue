
<script>

import _debounce from 'lodash/debounce'

import { VDataTable } from 'vuetify/lib'
import PopupMenu from '../core/PopupMenu'
import MenuTile from '../core/MenuTile'

import config from '../../config'

import drive from '../../drive'
import driveChanges from '../../drive/changes'
import dialog from '../core/dialog'
import { newAssignment, openAssignment } from './assignment'

export default {
  name: 'AssignmentListing',

  components: {
    VDataTable, PopupMenu, MenuTile
  },

  props: {
    properties: {
      type: String,
      default: null
    },
    mime_type: {
      type: String,
      required: true
    },
    creator: {
      type: Boolean,
      required: true
    },
    include_grade: {
      type: Boolean,
      default: false
    }
  },

  data: function() {
    return {
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

  computed: {
    edit_path: function() {
      return this.mime_type === config.gdrive.assignmentMimeType ? "/assignment/" : "/edit/";
    },
    headers() {

      let hdrs = [
        { text: 'Type', value: 'icon', sortable: false, width: '5%' },
        { text: 'Name', value: 'name' },
      ];
      
      if (this.include_grade) {
        hdrs.push({ text: 'Grade', value: 'grade' });
      }

      return hdrs.concat([
        { text: 'Instructor', value: 'owner', sortable: false},
        { text: 'Last viewed', value: 'lastViewed' },
        { text: 'File size', value: 'size' },
        { text: 'Actions', sortable: false , width: '5%'}
      ]);
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
          properties: this.properties,
          search: this.search,
          mimeType: this.mime_type
        })
        .then(files => {
          this.items = files.map(file => {
            return {
              id: file.id,
              icon: file.icon,
              name: file.name,
              grade: file.properties ? file.properties.grade : null,
              owner: file.owner,
              lastViewed: file.lastViewed,
              size: file.size
            }
          });
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          dialog.error("Drive Error", error.message);
        });
    },

    onNewAssignment() {
      newAssignment(this.mime_type, this.edit_path);
    },

    onOpenAssignment() {
      openAssignment(this.mime_type, this.edit_path)
    },


    onSearchChanged: _debounce(function() { 
      if (this.search)
        this.pagination.sortBy = '';
      else
        this.pagination.sortBy = 'lastViewed';
      this.updateItems();
    }, 500),

    
    onAssignmentClicked(doc) {
      this.$router.push({ path: this.edit_path + doc.id });
    },

    onRemoveAssignment(doc) {
      dialog
        .confirm ('Remove Assignment', 'Are you sure you want to remove this assignment?')
        .then(confirmed => {
          if (confirmed)
            this.handleDriveRequest(drive.removeFile(doc.id));
        });
    },

    onRenameAssignment(doc) {
      dialog
        .prompt('Rename Assignment', 'New name for assignment:')
        .then(title => {
          if (title)
            this.handleDriveRequest(drive.renameFile(doc.id, title));
        });
    },

    onOpenInNewTab(doc) {
      window.open(this.edit_path + doc.id, "_blank");
    },

    handleDriveRequest(request) {
      request
        .then(() => {
          this.updateItems();
        })
        .catch(error => {
          dialog.error("Drive Error", error.message);
        });
    }

  },

}

</script>


<template>

  <div class="recent-assignments">

    <v-card>
      <v-card-title>
       
        <v-btn v-if="creator" title="Create new" color="orange" fab dark small @click="onNewAssignment">
          <v-icon>add</v-icon>
        </v-btn>

        <v-btn title="Open picker" color="orange" fab outline dark small @click="onOpenAssignment">
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
        no-data-text="(None found)"
        class="assignments-table"
      >

        <template v-slot:no-data>
          <div class="table-status text-xs-center grey--text">
            <span v-if="loading">Loading...</span>
            <span v-else>(No assignments)</span>
          </div>
        </template>

        <template v-slot:no-results>
          <div class="table-status text-xs-center grey--text">
            (None)
          </div>
        </template>

        <template v-slot:items="props">
          <tr class="table-row">
            <td @click="onAssignmentClicked(props.item)"><img :src="props.item.icon"></td>
            <td class="table-doc-name" @click="onAssignmentClicked(props.item)">
              {{ props.item.name }}
            </td>
            <td v-if="include_grade" @click="onAssignmentClicked(props.item)">
              <span v-if="props.item.grade">{{ props.item.grade }}</span>
              <span v-else>&mdash;</span>
            </td>
            <td @click="onAssignmentClicked(props.item)">{{ props.item.owner }}</td>
            <td @click="onAssignmentClicked(props.item)">{{ new Date(props.item.lastViewed).toDateString() }}</td>
            <td @click="onAssignmentClicked(props.item)">{{ props.item.size | bytes }}</td>
            <td align="center">
              <PopupMenu>
                <MenuTile v-if="creator" icon="text_fields" text="Rename..." @clicked="onRenameAssignment(props.item)" />
                <MenuTile v-if="creator" icon="delete" text="Remove..." @clicked="onRemoveAssignment(props.item)" />
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


.recent-assignments td > a {
  text-decoration: none;
}

.recent-assignments .v-card__title {
  padding-left: 8px;
}

.recent-assignments .table-status {
  padding-top: 70px;
  padding-bottom: 80px;
}

.recent-assignments .table-doc-name {
  font-weight: 500;
}

.recent-assignments .table-doc-name i {
  margin-left: 10px;
}

.recent-assignments .table-row {
  cursor: pointer;
}

.recent-assignments .table-row i {
   color: rgba(0,0,0,0.54) !important;
}

</style>