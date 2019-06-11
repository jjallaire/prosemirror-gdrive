
export const SET_DOC_STATUS = 'SET_DOC_STATUS'

import { setStudentAssignmentStatus } from '../components/assignments/assignment.js'
import { SET_DOC_PROPERTIES } from './mutations.js';

export default {

  [SET_DOC_STATUS]( { commit, state }, { status, grade } ) {
    
    // update on google
    return setStudentAssignmentStatus(state.doc.id, status, grade)
      .then(() => {
        // update the local store
        let props = { status };
        if (grade)
          props.grade = grade;
        commit(SET_DOC_PROPERTIES, props );
      });
  },

}

