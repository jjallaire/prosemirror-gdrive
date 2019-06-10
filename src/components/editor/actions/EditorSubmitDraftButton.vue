<script>

import EditorActionButton from './EditorActionButton.vue'

import { Status } from '../../assignments/assignment.js'

export default {
  name: 'EditorSubmitDraftButton',
  extends: EditorActionButton,
 
  data: function() {
    return {
      icon: 'assignment',
      caption: 'Submit Draft',
      prompt: "Submit a draft of this assignment now?",
      status: Status.TeacherReview,
    }
  },
}

</script>

