


import store from '../store'
import { UPDATE_SETTINGS } from '../store/mutations'

import drive from '.'

import { jsonStringifyEscaped } from '../core/json'

const kSettingsFile = "settings.json";
const kSettingsMimeType = "application/json";

export function initSettings() {

  return syncSettings()
    .then(() => {
      // write settings back to the drive when they change
      store.watch(
        (state, getters) => getters.settings,
        (settings) => {
          drive.writeAppData(
            kSettingsFile, 
            kSettingsMimeType, 
            jsonStringifyEscaped(settings)
          );
        },
        { deep: true } 
      );
    });
}


export function syncSettings() {

  return drive
    .readAppData(
      kSettingsFile, 
      kSettingsMimeType, 
      jsonStringifyEscaped(store.getters.settings)
    )
    .then(file => {
      // write settings
      let settings = JSON.parse(file.content);
      store.commit(UPDATE_SETTINGS, settings);
    });


}

