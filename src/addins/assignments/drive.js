



import config from '../../config'

import drive from '../../drive'


// status:
//   draft
//   draft_review
//   draft_revisions
//   submitted
//   complete

// TODO: unload dialog on error


export function assignToStudent(assignment, student) {

  // properties
  let properties = {
    assignmentId: assignment.metadata.id,
    status: 'draft'
  };

  // create assignment and share it
  return drive
    .newFile(assignment.metadata.name, '{ "document": "" }', '', config.gdrive.mimeType, properties)
    .then(result => {
      return drive.shareFile(result.id, 'writer', 'user', student)
    });
}


