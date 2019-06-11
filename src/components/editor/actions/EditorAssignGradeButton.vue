<script>

import EditorActionButton from './EditorActionButton.vue'

import { Status } from '../../assignments/assignment.js'

export default {
  name: 'EditorAssignGradeButton',
  extends: EditorActionButton,
 
  data: function() {
    return {
      icon: 'assignment_turned_in',
      caption: 'Grade Assignment',
      prompt: "Grade this assignment now?",
      status: Status.Complete
    }
  },
}

</script>

