


import store from '../store'
import { UPDATE_SETTINGS } from '../store/mutations'

import drive from '.'

export function initSettings() {

  const kSettingsFile = "settings.json";
  const kSettingsMimeType = "application/json";

  return drive
    .readAppData(
      null, 
      kSettingsFile, 
      kSettingsMimeType, 
      JSON.stringify(store.getters.settings)
    )
    .then(file => {

      // apply settings
      let settings = JSON.parse(file.content);
      store.commit(UPDATE_SETTINGS, settings);

      // write settings back to the drive when they change
      store.watch(
        (state, getters) => getters.settings,
        (settings) => {
          drive.writeAppData(
            file.metadata.id, 
            kSettingsFile, 
            kSettingsMimeType, 
            JSON.stringify(settings)
          );
        },
        {
          deep: true
        } 
      );
  });

}

