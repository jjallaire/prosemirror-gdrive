
import config from '../../config'

import dialog from './dialog'
import drive from '../../drive'
import router from '../../core/router'

export function newDocument(mimeType = config.gdrive.mimeType, editPath = "/edit/") {
  dialog
    .prompt('New Document', 'Title')
    .then(title => {
      if (title)
        return drive.newFile(title, '{ "document": "" }', '', mimeType);
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

export function openDocument(mimeType = config.gdrive.mimeType, editPath = "/edit/") {
  drive.selectFile(mimeType)
    .then(id => {
      router.push({ path: editPath + id });
    });
}


