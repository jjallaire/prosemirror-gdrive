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

  created() {
    if (this.doc_id === null) {
      drive.newFile().then(id => {
        this.doc_id = id;
        this.loadFile();
      });
    } else {
      this.loadFile();
    }

  },


  methods: {
    loadFile() {
      drive.loadFile(this.doc_id)
        .then(file => {
          this.content = file.content;
        })
        .catch(error => {
          console.log(error);
        });
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
    </div>
    <div v-else>
      <div class="new-document-progress" />
      <ProgressSpinner />
    </div>
  </div>
  
</template>

<style>

.edit-container { 
  width: 100%;
}

.new-document-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 1000;
  opacity: 0.5;
}

</style>