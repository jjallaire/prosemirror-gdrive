


export function focusDialogTitle() {
   setTimeout(() => {
    let titleInput = document.querySelector('.v-dialog input[autofocus]');
    if (titleInput)
      titleInput.focus();
    }, 200);
}