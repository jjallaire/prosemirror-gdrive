<script>


// eslint-disable-next-line 
import drive from '../../drive'

import ProgressSpinner from '../core/ProgressSpinner.vue'

export default {
  name: 'EditPage',

  components: {
    ProgressSpinner
  },

  props: {
    doc_id: {
      type: String,
      default: null
    }
  },

  data: function() {
    return {
      content: null
    }
  },

  watch: {
    '$route': 'initDoc'
  },

  created() {
    this.initDoc();
  },

  methods: {

    initDoc() {

      this.content = null;

      if (this.doc_id === null) {
        drive.newFile()
          .then(id => {
            this.$router.push({ path: "/edit/" + id });
          });
      } else {
        drive.loadFile(this.doc_id)
          .then(file => {
            this.content = file.content;
          })
          .catch(error => {
            console.log(error);
          });
      }
    },

    onShareClicked() {
      drive.shareFile(this.doc_id);
    }
  }
}

</script>


<template>

  <div class="edit-container">
    <div v-if="content">
      <strong>
        {{ doc_id }}
      </strong>
      <p>
        {{ content }}
      </p>
      <p>
        <button @click="onShareClicked">Share</button>
      </p>

    </div>
    <div v-else>
      <ProgressSpinner />
    </div>
  </div>
  
</template>

<style>

.edit-container { 
  width: 100%;
}


</style>