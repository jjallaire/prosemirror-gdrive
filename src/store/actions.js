
export const SET_DOC_STATUS = 'SET_DOC_STATUS'


import { setStudentAssignmentStatus } from '../components/assignments/assignment.js'
import { SET_DOC_PROPERTIES } from './mutations.js';
import { manageRevisions } from '../drive/revisions.js'


import store from '../store'


export default {

  [SET_DOC_STATUS]( { commit, state }, { status, grade } ) {
    
    // wait for a clean doc
    return waitForCleanDoc()
      // set status on gdrive
      .then(() => {
        return setStudentAssignmentStatus(state.doc.id, status, grade)
      })
      // update the local store
      .then(() => {
        let props = { status };
        if (grade)
          props.grade = grade;
        commit(SET_DOC_PROPERTIES, props );
      })
      // manage revisions
      .then(() => {
        return manageRevisions(store.getters.doc);
      })
  },

}


function waitForCleanDoc() {
  return new Promise(resolve => {
    let intervalId = setInterval(() => {
      let save_status = store.getters.save_status;
      if (save_status !== "dirty") {
        clearInterval(intervalId);
        resolve();
      }
    }, 200);
  });
}
