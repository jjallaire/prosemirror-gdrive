
export default {

  app: {
    title: "Prosemirror GDrive",
    storage: "promisemirror-gdrive"
  },

  ga: {
    id: "UA-77306155-4"
  },
  sentry: {
    dsn: "https://e4ef4a78cc9247b28b3d8e93bc9ddd87@sentry.io/1420968"
  },

  gdrive: {
    appId: "880472811488",
    clientId: "880472811488-1hm06rum32dj0g28hkcedfb6h456ll4l.apps.googleusercontent.com",
    apiKey: process.env.VUE_APP_API_KEY || "AIzaSyCT-dDWWmNJawfBf-Lot471GGtQrYk1fMQ",
    assignmentMimeType: 'application/vnd.google.drive.ext-type.pmasn',
    studentAssignmentMimeType: 'application/vnd.google.drive.ext-type.pmdoc',
  },

  filestack: {
    apiKey: process.env.VUE_APP_FILESTACK_API_KEY || null
  },

  roles: {
    teachers: process.env.VUE_APP_TEACHERS ? process.env.VUE_APP_TEACHERS.split(/, /) : null
  }

}

