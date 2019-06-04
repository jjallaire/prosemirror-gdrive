

<script>

import DocumentListing from './navigation/DocumentListing.vue'

import { mapGetters } from 'vuex'

import config from '../config'

import { isTeacher } from '../store/selectors'

export default {
  name: 'HomePage',

  components: {
    DocumentListing
  },

  computed: {
    ...mapGetters([
      'authorized',
      'user',
    ]),

    is_teacher: function() {
      return this.authorized && isTeacher(this.user);
    },

    mime_type: function() {
      return this.is_teacher ? config.gdrive.assignmentMimeType : config.mimeType
    }
  },

}

</script>


<template>

  <div class="home-container">
    <DocumentListing :mime_type="mime_type" />
  </div>

</template>

<style>
.home-container {
  width: 100%;
  height: 100%;
}

</style>