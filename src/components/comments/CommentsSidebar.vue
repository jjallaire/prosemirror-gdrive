<script>

import drive from '../../drive'
import dialog from '../core/dialog'

import { mapGetters } from 'vuex'

export default {
  name: 'CommentsSidebar',

  data: function() {
    return {
      comment: null,
      comments: []
    }
  },

  computed: {

    ...mapGetters([
      'doc'
    ]),

  },

  watch: {
    doc: {
      handler () {
        this.updateComments();
      },
      deep: true
    }
  },

  methods: {
    onAddComment() {
      drive
        .addComment(this.doc.id, this.comment)
        .then(() => {
          this.comment = ''
          return this.updateComments();
        })
        .catch(error => {
          dialog.errorSnackbar(`Error adding comment: ${error.message}`);
        });
    },

    updateComments() {
      if (this.doc.id) {
        drive
          .listComments(this.doc.id)
          .then(result => {
            this.comments = result;
          })
          .catch(error => {
            dialog.errorSnackbar(`Error listing comments: ${error.message}`);
          });
      } else {
        this.comments = [];
      }

    }
  }

}

</script>

<template>

  <div class="comments-sidebar">
    <v-text-field v-model="comment" />
    <v-btn @click="onAddComment">Add</v-btn>
    <div v-for="c in comments" :key="c.id">
      {{ c.htmlContent }}
    </div>
  </div>

</template>

<style>

.comments-sidebar {
  padding: 8px;
}

</style>