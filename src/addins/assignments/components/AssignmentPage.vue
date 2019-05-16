


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
            text: 'Foo',
            value: 'foo'
          },
          {
            text: 'Bar',
            value: 'bar'
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
        <v-layout style="height: 90vh;">

          <v-flex sm5>
            <v-text-field label="Title" box />
            <EditorComponent ref="editor" class="assignment-editor" :minimal_toolbar="true" />
          </v-flex>
          <v-flex class="students-table-container" sm7>
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
.assignment-page .layout,
.assignment-page .v-card {
  height: 100%;
  width: 100%;
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
