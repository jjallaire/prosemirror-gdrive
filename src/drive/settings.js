


import store from '../store'

export default {

  init() {
    return new Promise(resolve => {

      // watch for settings changes and write them to gdrive
      store.watch(
        (state, getters) => getters.settings,
        (settings) => {
          console.log("settings changed");
          console.log(settings);
        },
        {
          deep: true
        }
        
      );

      resolve();
    });
  }



}