<script>

import EditorActionButton from './EditorActionButton.vue'

import { Status } from '../../assignments/assignment.js'

export default {
  name: 'EditorSubmitFinalDraftButton',
  extends: EditorActionButton,
 
  data: function() {
    return {
      icon: 'assignment_turned_in',
      caption: 'Submit Final Draft',
      prompt: "Submit the final draft of this assignment now?",
      status: Status.TeacherEvaluate
    }
  },
}

</script>

