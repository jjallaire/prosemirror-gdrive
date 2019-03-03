

import localforage from 'localforage'

var userStore = localforage.createInstance({
  name: "promisemirror-gdrive",
  storeName: "user"
});

var docStore = localforage.createInstance({
  name: "promisemirror-gdrive",
  storeName: "docs"
});

export default {

  onSignInChanged: null,

  connect(onSignInChanged) {
    this.onSignInChanged = onSignInChanged;
    return Promise.resolve();
  },

  signIn() {
    userStore.setItem("user", { 
      id: 1,
      name: "Local User",
      email: "user@localhost"
    }).then(() => {
      this.onSignInChanged();
    });
  },

  signOut() {
    userStore.setItem("user", null)
      .then(() => {
        this.onSignInChanged();
      });
  },

  signedInUser() {
    return userStore.getItem("user");
  },

  listFiles() {
    return Promise.resolve([]);
  },

};
