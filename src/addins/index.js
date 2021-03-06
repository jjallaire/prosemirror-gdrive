

import config from '../config'
import router from '../core/router'

const navigationItems = [];
const navigationGroups = [];

export function addinRegister(addin) {

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

  // add navigation items
  if (addin.navigation && addin.navigation.items)
    navigationItems.push(...addin.navigation.items)

  // add navigation groups
  if (addin.navigation && addin.navigation.groups)
    navigationGroups.push(...addin.navigation.groups)
}

export function addinNavigation() {
  return {
    items: navigationItems,
    groups: navigationGroups
  }
}

