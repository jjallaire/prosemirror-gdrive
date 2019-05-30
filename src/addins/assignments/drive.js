



import config from '../../config'

import drive from '../../drive'

import { emptyDocument } from '../../components/core/docs.js'


// status:
//   draft
//   draft_review
//   draft_revisions
//   submitted
//   complete
//   unassigned

// TODO: unload dialog on error
//   issue may be the list of promises?


export function assignToStudent(id, title, student) {

  // properties
  let properties = {
    assignmentId: id,
    status: 'draft'
  };

  // create assignment and share it
  return drive
    .newFile(title, emptyDocument(), '', config.gdrive.mimeType, properties)
    .then(result => {
      return drive.shareFile(result.id, 'writer', 'user', student)
    });
}


