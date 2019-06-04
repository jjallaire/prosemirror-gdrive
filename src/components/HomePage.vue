

<script>

import AssignmentListing from './assignments/AssignmentListing.vue'

import { mapGetters } from 'vuex'

import config from '../config'

import { SET_PAGE_TITLE } from '../store/mutations'

import { isTeacher } from '../store/selectors'

export default {
  name: 'HomePage',

  components: {
    AssignmentListing
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
      return this.is_teacher ? config.gdrive.assignmentMimeType : config.gdrive.studentAssignmentMimeType
    }
  },

  mounted() {
    this.$store.commit(SET_PAGE_TITLE, "Assignments");
  },

  beforeDestroy() {
    this.$store.commit(SET_PAGE_TITLE, null);
  }

}

</script>


<template>

  <div class="home-container">
    <AssignmentListing :mime_type="mime_type" />
  </div>

</template>

<style>
.home-container {
  width: 100%;
  height: 100%;
}

</style>