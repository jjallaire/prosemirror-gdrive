import Vue from 'vue'

export const SET_INITIALIZED = 'SET_INITIALIZED'
export const SET_INIT_ERROR = 'SET_INIT_ERROR'
export const SET_USER = 'SET_USER'
export const SET_DOC = 'SET_DOC'
export const SET_SAVE_STATUS = 'SET_SAVE_STATUS'
export const SET_DOC_PROPERTIES = 'SET_DOC_PROPERTIES'
export const SET_PAGE_TITLE = 'SET_PAGE_TITLE'
export const SET_PAGE_TITLE_LINK = 'SET_PAGE_TITLE_LINK'
export const SET_PAGE_SUBTITLE = 'SET_PAGE_SUBTITLE'
export const UPDATE_SETTINGS = 'UPDATE_SETTINGS'
export const SET_SNACKBAR_ERROR = 'SET_SNACKBAR_ERROR'

export default {

  [SET_INITIALIZED](state, initialized) {
    state.initialized = initialized;
  },

  [SET_INIT_ERROR](state, error) {
    state.init_error = error;
  },

  [SET_USER](state, user) {
    state.user = user;
  },


  [SET_PAGE_TITLE](state, page_title) {
    state.page_title = page_title;
  },

  [SET_PAGE_TITLE_LINK](state, page_title_link) {
    state.page_title_link = page_title_link;
  },

  [SET_PAGE_SUBTITLE](state, page_subtitle) {
    state.page_subtitle = page_subtitle;
  },

  [SET_DOC](state, doc) {
    state.doc = doc;
  },

  [SET_SAVE_STATUS](state, save_status) {
    state.save_status = save_status;
  },

  [SET_DOC_PROPERTIES](state, properties) {
    Vue.set(state.doc, "properties", {
      ...state.doc.properties,
      ...properties
    });
  },

  [UPDATE_SETTINGS](state, settings) {
    Object.keys(settings).forEach(setting => {
      Vue.set(state.settings, setting, settings[setting]);
    });
  },

  [SET_SNACKBAR_ERROR](state, error) {
    state.snackbar_error = error;
  },
};