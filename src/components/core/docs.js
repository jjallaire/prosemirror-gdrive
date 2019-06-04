
import dialog from './dialog'
import drive from '../../drive'
import router from '../../core/router'

export function emptyDocument() {
  return '{ "document": "" }';
}

export function newDocument(mimeType, editPath) {
  dialog
    .prompt('New Document', 'Title')
    .then(title => {
      if (title)
        return drive.newFile(title, emptyDocument(), '', mimeType);
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

export function openDocument(mimeType, editPath) {
  drive.selectFile(mimeType)
    .then(id => {
      router.push({ path: editPath + id });
    });
}


