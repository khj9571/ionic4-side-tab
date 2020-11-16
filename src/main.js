import Vue from "vue";
import App from "./App.vue";
import Ionic from "@ionic/vue";

import router from './router'
import "@ionic/core/css/core.css";
import "@ionic/core/css/ionic.bundle.css";

// router
// import { IonicVueRouter } from "@ionic/vue";
// Vue.use(IonicVueRouter);

Vue.config.productionTip = false;
Vue.use(Ionic);

// const router = new IonicVueRouter({
//   // mode: "history",
//   // base: process.env.BASE_URL,
//   routes: [
//     { path: "/", redirect: "/home" },
//     {
//       path: "/home",
//       name: "home",
//       component: () =>
//         import(/* webpackChunkName: "home" */ "@/views/Home"),
//     },
// {
//   path: "/new-item",
//   name: "new-item",
//   component: () =>
//     import(/* webpackChunkName: "new-item" */ "@/views/About"),
// }
//   ]
// });

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");