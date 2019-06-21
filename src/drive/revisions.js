

import drive from '.'
import { Status } from '../components/assignments/assignment.js'

// there are certain revisions we want to preserve forever (e.g. draft turned in by student
// and final draft turned in by student). this function checks the assignment status, 
// then records and sets the keepForever flag on the revision if it hasn't been already recorded
export function manageRevisions(doc) {

  let preserveRevisions = [
    {
      status: Status.StudentRevision,
      revision: "draftRevisionId"
    },
    {
      status: Status.TeacherEvaluate,
      revision: "finalRevisionId"
    }
  ];

  for (let i=0; i<preserveRevisions.length; i++) {
    let preserve = preserveRevisions[i];
    if ((doc.properties.status === preserve.status) && !doc.properties[preserve.revision]) {
      let revisionId = doc.headRevisionId;
      return drive.
        setFileProperties(doc.id, { [preserve.revision]: revisionId } )
        .then(() => {
          return drive.updateRevision(doc.id, revisionId, { keepForever: true });
        })
    }
  }

  // no-op
  return Promise.resolve();

}

