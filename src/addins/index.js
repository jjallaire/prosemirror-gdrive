

import config from '../config'
import router from '../core/router'

const actions = [];
const navigationItems = [];
const navigationGroups = [];
const behaviors = [];
const editorTypes = [];

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

  // add actions
  if (addin.actions)
    actions.push(...addin.actions);

  // add behaviors
  if (addin.behaviors)
    behaviors.push(addin.behaviors);

  // add editor types
  if (addin.editorTypes)
    editorTypes.push(...addin.editorTypes);
}

export function addinNavigation() {
  return {
    items: navigationItems,
    groups: navigationGroups
  }
}

export function addinActions() {
  return actions;
}

export function addinBehaviors() {
  return behaviors;
}

export function addinEditorPath(mimeType) {

  for (let i=0; i<editorTypes.length; i++) {
    if (editorTypes[i].mimeType === mimeType)
      return editorTypes[i].path;
  }

  return null;
}