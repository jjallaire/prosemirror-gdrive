<script>

import EditorActionButton from './EditorActionButton.vue'

import { Status } from '../../assignments/assignment.js'

export default {
  name: 'EditorAssignGradeButton',
  extends: EditorActionButton,
 
  data: function() {
    return {
      icon: 'assignment_turned_in',
      caption: 'Assign Grade',
      prompt: "Grade",
      status: Status.Complete,
      enter_grade: true
    }
  },
}

</script>

