
import Vue from 'vue'
import Home from '../views/Home.vue'
import { IonicVueRouter } from '@ionic/vue';

Vue.use(IonicVueRouter);

export default new IonicVueRouter({
   mode: 'history',
  // base: process.env.BASE_URL,
  routes: [
    { path: "/", redirect: "/home" },
    {
      path: "/home",
      name: "home",
      component: () =>
        import(/* webpackChunkName: "home" */ "@/views/Home"),
    },
    {
      path: "/menu1",
      name: "menu1",
      component: () =>
        import(/* webpackChunkName: "new-item" */ "@/views/Menu1"),
    },
    {
      path: "/menu2",
      name: "menu2",
      component: () =>
        import(/* webpackChunkName: "new-item" */ "@/views/Menu2"),
    },
    {
      path: "/menu3",
      name: "menu3",
      component: () =>
        import(/* webpackChunkName: "new-item" */ "@/views/Menu3"),
    }
  ]
});