import Vue from "vue";
import App from "./App.vue";
import Ionic from "@ionic/vue";

import router from './router'
import "@ionic/core/css/core.css";
import "@ionic/core/css/ionic.bundle.css";

import axios from 'axios'
import VueAxios from 'vue-axios'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI);

Vue.use(VueAxios, axios)

Vue.config.productionTip = false;
Vue.use(Ionic);


import AppPlugIn from './plugins/index'
Vue.use(AppPlugIn)



new Vue({
  router,
  render: h => h(App)
}).$mount("#app");