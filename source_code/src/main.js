import Vue from "vue";
import vuetify from "./plugins/vuetify";
import app from "./app.vue";
import router from "./router";
import store from "./store";
import planes from "@/../public/files/planes.json"
import "./registerServiceWorker.js";

Vue.prototype.json = planes;

import("@/../public/files/RWY.json")
  .then((module) => {
    Vue.prototype.RWY = module.default;
  });

new Vue({
  router,
  store,
  vuetify,
  render: h => h(app)
}).$mount("#app");
