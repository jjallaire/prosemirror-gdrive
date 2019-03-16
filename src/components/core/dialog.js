
import Vue from 'vue'

const dialog = Vue.prototype['$dialog']

export default {

  prompt(title, text) {
    let prompt = dialog.prompt({
      title: title,
      text: text
    });
    focusDialogTitle();
    return prompt;
  },

  confirm(title, text) {
    return dialog.confirm({
      title: title,
      text: text
    });
  },

  error(title, text) {
    return dialog.error({
      title: title,
      text: text
    });
  }
  
}

function focusDialogTitle() {
  setTimeout(() => {
   let titleInput = document.querySelector('.v-dialog input[autofocus]');
   if (titleInput)
     titleInput.focus();
   }, 200);
}
