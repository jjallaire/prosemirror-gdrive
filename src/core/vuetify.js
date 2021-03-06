import Vue from 'vue'

// vuetify
import Vuetify, { 
  VDialog, VCard, VCardTitle, VCardText, VCardActions, VSpacer, 
  VBtn, VToolbar, VIcon, VToolbarTitle, VTextField } from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'
import 'typeface-roboto'
import 'material-icons/iconfont/material-icons.css'
Vue.use(Vuetify, {
  iconfont: 'md',
  components: {
    VDialog, VCard, VCardTitle, VCardText, VCardActions, VSpacer, 
    VBtn, VToolbar, VIcon, VToolbarTitle, VTextField
  }
})

// Numeral.js filters
import vueNumeralFilterInstaller from 'vue-numeral-filter';
Vue.use(vueNumeralFilterInstaller, { locale: 'en-gb' });

// Vuetify dialog
import VuetifyDialog from 'vuetify-dialog'
Vue.use(VuetifyDialog)

