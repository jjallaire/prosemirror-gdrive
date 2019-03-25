
import Vue from 'vue'

import store from '../../store'
import { SET_SNACKBAR_ERROR } from '../../store/mutations';

const dialog = Vue.prototype['$dialog']

export default {

  prompt(title, text) {
    let prompt = dialog.prompt({
      title: title,
      text: text
    });
    dialogAutoFocus();
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
  },
  
  errorSnackbar(text) {
    store.commit(SET_SNACKBAR_ERROR, text);
  }

}

export function dialogAutoFocus(select) {
  setTimeout(() => {
    let input = document.querySelector('.v-dialog input[autofocus]');
    if (input) {
      input.focus();
      if (select && input.select)
        input.select();
   }
  }, 200);
}
