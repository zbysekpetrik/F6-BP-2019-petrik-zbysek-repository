import Vue from "vue";
import Vuex from "vuex";

import pathify from "./pathify";

// import helper function
import { make } from "vuex-pathify";
// setup store
const state = {
  hangarPanel: [],
  topNav: [true, ""],
  bottomNavDisabled: [true, true, true, true],
  selectedPlane: [],
  lastPlane: null
};

const mutations = make.mutations(state);
const getters = make.getters(state);

// use store
Vue.use(Vuex);

// create store
export default new Vuex.Store({
  // use the plugin
  plugins: [pathify.plugin],

  // store properties
  state,
  mutations,
  getters
});