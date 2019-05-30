



import config from '../../config'

import drive from '../../drive'

import { emptyDocument } from '../../components/core/docs.js'


export const Status = {
  TeacherReview: 1,
  TeacherEvaluate: 2,
  StudentDraft: 3,
  StudentRevision: 4,
  Completed: 5,
  Unassigned: 6
}

export function studentAssignments(id) {
  return drive.listFiles({
    properties: `properties has { key='assignmentId' and value='${id}' }`,
    mimeType: config.gdrive.mimeType
  })
}

export function assignToStudent(id, title, student, teacher) {

  // properties
  let properties = {
    assignmentId: id,
    student: student,
    teacher: teacher,
    status: Status.StudentDraft
  };

  // create assignment and share it
  return drive
    .newFile(title, emptyDocument(), '', config.gdrive.mimeType, properties)
    .then(result => {
      return drive.shareFile(
        result.id, 
        'writer', 
        'user', 
        student,
        `You have received an assignment from ${teacher}`
      )
    });
}


