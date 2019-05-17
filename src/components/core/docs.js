
import dialog from './dialog'
import drive from '../../drive'
import router from '../../core/router'

export function newDocument() {
  dialog
    .prompt('New Document', 'Title')
    .then(title => {
      if (title)
        return drive.newFile(title, '{ "document": "" }');
      else
        return Promise.resolve();
    })
    .then(result => {
      if (result)
        router.push({ path: "/edit/" + result.id });
    })
    .catch(error => {
      dialog.error("Drive Error", error.message);
    });
}

export function openDocument() {
  drive.selectFile()
    .then(id => {
      router.push({ path: "/edit/" + id });
    });
}


