import Vue from 'vue'
// import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import  { store } from './store/index.js'
import Moralis from './plugins/moralis'

import HomeLayout from './layouts/HomeLayout'
import '../node_modules/nprogress/nprogress.css'





Vue.config.productionTip = false




Vue.component('home-layout',HomeLayout)

export const bus = new Vue();

new Vue({
  store,
  router,
  vuetify,
  Moralis,
  render: h => h(App)
}).$mount('#app')
