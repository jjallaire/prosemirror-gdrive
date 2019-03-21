import Vue from 'vue'

import * as Sentry from '@sentry/browser';

import config from '../config'

const production = process.env.NODE_ENV === 'production';


export function initialize() {

  // configure sentry in production mode
  if (useSentry()) {
    Sentry.init({
      dsn: config.sentry.dsn,
      integrations: [new Sentry.Integrations.Vue({ Vue })]
    });
    if (process.env.VUE_APP_BRANCH) {
      Sentry.configureScope((scope) => {
        scope.setTag("branch", process.env.VUE_APP_BRANCH);
      });
    }
  }

}

export function addBreadcrumb(category, message, level = 'info') {
  Sentry.addBreadcrumb({
    category: category,
    message: message,
    level: level
  });
}

export function logException(error, tag) {
  console.log(tag + ": " + error.message);
  if (useSentry()) {
    Sentry.withScope(scope => {
      if (tag)
        scope.setTag("tag", tag);
      Sentry.captureException(error);
    });
  }
}

export function logMessage(message) {
  console.log(message);
  if (useSentry())
    Sentry.captureMessage(message);
}

function useSentry() {
  return config.sentry.dsn && production;
}

