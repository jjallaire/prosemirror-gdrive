

import config from '../config'

export function isTeacher(user) {
  return config.roles.teachers.indexOf(user.email) !== -1;
}
