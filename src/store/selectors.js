

import config from '../config'

import { Status } from '../components/assignments/assignment.js'

export function isTeacher(user) {
  return config.roles.teachers.indexOf(user.email) !== -1;
}

export function actionButton(user, status) {

  if (!status || !user) {
    return null;
  } else if (isTeacher(user)) {
    switch(status) {
      case Status.StudentDraft:
        return null;
      case Status.TeacherReview:
        return "return-draft";
      case Status.StudentRevision:
        return null;
      case Status.TeacherEvaluate:
      case Status.Complete:
        return "assign-grade";
      default:
        return null;
    }
  } else {
    switch(status) {
      case Status.StudentDraft:
        return "submit-draft";
      case Status.TeacherReview:
        return null;
      case Status.StudentRevision:
        return "submit-final-draft";
      case Status.TeacherEvaluate:
        return null;
      default:
        return null;
    }
  }      

}

export function statusMessage(user, status, grade) {
  if (!status || !user) {
    return null;
  } if (isTeacher(user)) {
    switch(status) {
      case Status.StudentDraft:
        return "Draft in Progress";
      case Status.TeacherReview:
        return null;
      case Status.StudentRevision:
        return "Final Draft in Progress";
      case Status.TeacherEvaluate:
        return null;
      case Status.Complete:
        return `Grade: ${grade}`;
      default:
        return null;
    }
  } else {
    switch(status) {
      case Status.StudentDraft:
        return null;
      case Status.TeacherReview:
        return "Draft Submitted";
      case Status.StudentRevision:
        return null;
      case Status.TeacherEvaluate:
        return "Final Draft Submitted";
      case Status.Complete:
        return `Grade: ${grade}`;
      default:
        return null;
    }
  }     


}
  
