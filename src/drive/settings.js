


import store from '../store'
import { UPDATE_SETTINGS } from '../store/mutations'

import drive from '.'

const kSettingsFile = "settings.json";
const kSettingsMimeType = "application/json";


export function initSettings() {

  return syncSettings()
    .then(id => {
      // write settings back to the drive when they change
      store.watch(
        (state, getters) => getters.settings,
        (settings) => {
          drive.writeAppData(
            id, 
            kSettingsFile, 
            kSettingsMimeType, 
            JSON.stringify(settings)
          );
        },
        { deep: true } 
      );
    });
}


export function syncSettings() {

  return drive
    .readAppData(
      null, 
      kSettingsFile, 
      kSettingsMimeType, 
      JSON.stringify(store.getters.settings)
    )
    .then(file => {

      // write settings
      let settings = JSON.parse(file.content);
      store.commit(UPDATE_SETTINGS, settings);
    
      // return id for settings file
      return file.metadata.id;
    });


}

