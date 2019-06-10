<script>

import EditorActionButton from './EditorActionButton.vue'

import { Status } from '../../assignments/assignment.js'

export default {
  name: 'EditorReturnDraftButton',
  extends: EditorActionButton,
 
  data: function() {
    return {
      icon: 'assignment_returned',
      caption: 'Return Draft',
      prompt: "Return reviewed draft to student?",
      status: Status.StudentDraft
    }
  },
}

</script>

