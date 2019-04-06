



import config from '../config'
import router from '../core/router'
import store from '../store'
import { ADD_NAVIGATION_GROUP } from '../store/mutations'


export function registerAddin(addin) {

  // merge config
  if (addin.config) {
    Object.keys(config).forEach(key => {
      config[key] = {
        ...config[key],
        ...addin.config[key]
      };
    });
  }

  // add routes
  if (addin.routes)
    router.addRoutes(addin.routes);

  // add navigation groups
  if (addin.navigation && addin.navigation.groups) {
    addin.navigation.groups.forEach(group => {
      store.commit(ADD_NAVIGATION_GROUP, group);
    });
  }
}