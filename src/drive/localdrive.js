

export default {

  onSignInChanged: null,

  connect(onSignInChanged) {
    this.onSignInChanged = onSignInChanged;
    this.onSignInChanged();
    return Promise.resolve();
  },

  signIn() {
   
  },

  signOut() {
   
  },

  signedInUser() {
    return {
      id: 1,
      name: "Local User",
      email: "user@localhost"
    }
  },

  listFiles() {
    
    return [];
  },

};
