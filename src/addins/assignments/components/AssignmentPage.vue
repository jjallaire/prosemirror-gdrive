


<script>

import AppPage from '../../../components/core/AppPage.vue'

import EditorComponent from '../../../components/editor/EditorComponent'


export default {

  name: 'AssignmentPage',

  components: {
    AppPage, EditorComponent
  },

  props: {
    doc_id: {
      type: String,
      required: true
    }
  },

  data: function() {
    return {
      students: {
        headers: [
          {
            text: 'Student',
            value: 'student'
          },
          {
            text: 'Status',
            value: 'status'
          }

        ],
        items: [
          {
            foo: 1,
            bar: 2
          },
          {
            foo: 3,
            bar: 4
          },
          {
            foo: 1,
            bar: 2
          },
          {
            foo: 3,
            bar: 4
          },
          {
            foo: 1,
            bar: 2
          },
          {
            foo: 3,
            bar: 4
          },
          {
            foo: 1,
            bar: 2
          },
          {
            foo: 3,
            bar: 4
          },
          {
            foo: 1,
            bar: 2
          },
          {
            foo: 3,
            bar: 4
          },
          {
            foo: 1,
            bar: 2
          },
          {
            foo: 3,
            bar: 4
          },
          {
            foo: 1,
            bar: 2
          },
          {
            foo: 3,
            bar: 4
          },
          {
            foo: 1,
            bar: 2
          },
          {
            foo: 3,
            bar: 4
          },
          {
            foo: 1,
            bar: 2
          },
          {
            foo: 3,
            bar: 4
          },
          {
            foo: 1,
            bar: 2
          },
          {
            foo: 3,
            bar: 4
          },
          {
            foo: 1,
            bar: 2
          },
          {
            foo: 3,
            bar: 4
          },
          {
            foo: 1,
            bar: 2
          },
          {
            foo: 3,
            bar: 4
          },
          {
            foo: 1,
            bar: 2
          },
          {
            foo: 3,
            bar: 4
          },
          {
            foo: 1,
            bar: 2
          },
          {
            foo: 3,
            bar: 4
          },
          {
            foo: 1,
            bar: 2
          },
          {
            foo: 3,
            bar: 4
          },
          {
            foo: 1,
            bar: 2
          },
          {
            foo: 3,
            bar: 4
          }
        ]
      }
    }
  },

  mounted() {
    this.$refs.page.initialize();
  }

}

</script>

<template>

  <AppPage ref="page" title="Assignment" class="assignment-page">

    <v-card>
      <v-card-text>
        <v-layout>

          <v-flex sm5>
            <v-text-field label="Title" box />
            <EditorComponent ref="editor" class="assignment-editor" :minimal_toolbar="true" />
          </v-flex>
          <v-flex class="students-table-container" sm7>
            <v-card>
              <v-card-title>
                <v-btn color="info">Assign to Students...</v-btn>
              </v-card-title>
              <v-data-table
                :headers="students.headers"
                :items="students.items"
                :hide-actions="true"
                class="elevation-1"
              >
                <template v-slot:items="props">
                  <td>{{ props.item.foo }}</td>
                  <td class="text-xs-right">{{ props.item.bar }}</td>
                </template>
              </v-data-table>
            </v-card>
          </v-flex>
            
      
        </v-layout>
      </v-card-text>
    </v-card>

  </AppPage>

</template>

<style>

.assignment-page {
  height: 100%;
  width: 100%;
}

.assignment-page > div,
.assignment-page .v-card {
  height: 100%;
  width: 100%;
}

.assignment-page .layout {
  height: calc(100vh - 100px)
}


.assignment-editor {
  height: calc(100vh - 180px);
  width: 100%;
}

.assignment-editor .v-card {
  height: 100%;
}

.assignment-page .students-table-container {
  margin-left: 24px;
  overflow-y: scroll;
}

</style>
