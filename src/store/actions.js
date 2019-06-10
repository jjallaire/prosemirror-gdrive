
export const SET_DOC_STATUS = 'SET_DOC_STATUS'

import { setStudentAssignmentStatus } from '../components/assignments/assignment.js'

export default {

  [SET_DOC_STATUS]( { commit, state }, status) {
    
    // update on google
    return setStudentAssignmentStatus(state.doc.id, status)
      .then(() => {
        // update the local store
        commit(SET_DOC_STATUS, status);
      });
  },

}

