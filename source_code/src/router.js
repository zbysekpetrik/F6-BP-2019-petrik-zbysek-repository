import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/404",
      name: "error",
      component: () =>
        import(/* webpackChunkName: "error" */ "./views/error.vue"),
    },
    { path: '*', redirect: '/404' },
    {
      path: "/",
      name: "hangar",
      component: () =>
        import(/* webpackChunkName: "hangar" */"./views/hangar.vue"),
    },
    {
      path: "/index.html",
      name: "hangar",
      component: () =>
        import(/* webpackChunkName: "hangar" */"./views/hangar.vue"),
    },
    {
      path: "/:plane",
      name: "info",
      component: () =>
        import(/* webpackChunkName: "info" */"./views/info.vue"),
    },
    {
      path: "/:plane/W&B",
      name: "W&B",
      component: () =>
        import(/* webpackChunkName: "W&B" */"./views/W&B.vue"),
    },
    {
      path: "/:plane/T-O",
      name: "Take-off",
      component: () =>
        import(/* webpackChunkName: "TO" */"./views/T-O.vue"),
    },
    {
      path: "/:plane/cruise",
      name: "Cruise",
      component: () =>
        import(/* webpackChunkName: "cruise" */"./views/cruise.vue"),
    },
    {
      path: "/:plane/LD",
      name: "Landing",
      component: () =>
        import(/* webpackChunkName: "LD" */"./views/LD.vue"),
    }
  ]
});