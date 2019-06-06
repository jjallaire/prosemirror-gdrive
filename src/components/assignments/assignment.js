



import config from '../../config'
import drive from '../../drive'
import dialog from '../core/dialog'
import router from '../../core/router'
import { jsonStringifyEscaped } from '../../core/json';

export const Status = {
  TeacherReview: 1,
  TeacherEvaluate: 2,
  StudentDraft: 3,
  StudentRevision: 4,
  Complete: 5,
  Unassigned: 6
}

export function emptyAssignment() {
  return '{ "document": "" }';
}

export function newAssignment(mimeType, editPath) {
  dialog
    .prompt('New Assignment', 'Title')
    .then(title => {
      if (title)
        return drive.newFile(title, emptyAssignment(), '', mimeType);
      else
        return Promise.resolve();
    })
    .then(result => {
      if (result)
        router.push({ path: editPath + result.id });
    })
    .catch(error => {
      dialog.error("Drive Error", error.message);
    });
}

export function openAssignment(mimeType, editPath) {
  drive.selectFile(mimeType)
    .then(id => {
      router.push({ path: editPath + id });
    });
}


export function studentAssignments(id) {
  return drive
    .listFiles({
      properties: `properties has { key='assignmentId' and value='${id}' }`,
      mimeType: config.gdrive.studentAssignmentMimeType
    })
    .then(assignments => {
      return assignments.map(assignment => {
        return {
          id: assignment.id,
          student: assignment.properties.student,
          teacher: assignment.properties.teacher,
          status: Number.parseInt(assignment.properties.status, 10),
          grade: assignment.properties.grade
        }
      });
    });
}

export function createStudentAssignment(id, title, description, student, teacher) {

  // properties
  let properties = {
    assignmentId: id,
    student: student,
    teacher: teacher,
    status: Status.StudentDraft,
    grade: null
  };

  // create the assignment
  let assignment = {
    document: '',
    description: description
  };

  // create assignment and share it
  return drive
    .newFile(title, jsonStringifyEscaped(assignment), '', config.gdrive.studentAssignmentMimeType, properties)
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

export function setStudentAssignmentStatus(id, status) {
  return drive
    .setFileProperties(id, {
      status: status.toString()
    });
}


