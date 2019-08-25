import Vue from "vue";
import vuetify from "@/plugins/vuetify";
import app from "@/app.vue";
import router from "@/router.js";
import store from "@/store.js";
import planes from "@/../public/files/planes.json"
import "@/registerServiceWorker.js";
import VueIdb from 'vue-idb'
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';

Vue.use(MuseUI);

Vue.prototype.json = planes;

import("@/../public/files/RWY.json")
  .then((module) => {
    Vue.prototype.RWY = module.default;
  });

Vue.use(VueIdb)

const idb = new VueIdb({
  version: 1,
  database: 'user_data',
  schemas: [
    { user_config: 'id, data, plane, username, created_at' }
  ]
})

new Vue({
  router,
  store,
  vuetify,
  idb: idb,
  render: h => h(app)
}).$mount("#app");
