<template>
  <div>
    <v-card style="margin-bottom: 10px">
      <v-img v-bind:src="planeInfo.img"></v-img>
      <div style="padding:0px">
        <v-card>
          <v-card-title style="display: flex; justify-content: space-between;">
            <h5>{{manufacturer}} {{planeInfo.plane}}</h5>
            <h5>{{selectedPlane[0]}}</h5>
          </v-card-title>
          <v-divider></v-divider>
          <flycalc-dynamic-list v-if="displayInfo.length > 0" :items="displayInfo"></flycalc-dynamic-list>
        </v-card>
        <div style="text-align:center;"></div>
      </div>
    </v-card>

    <v-snackbar
      style="margin: 20px"
      :timeout="0"
      v-model="snackBarRemove"
      color="warning"
      left
      bottom
      multi-line
    >
      Are you sure?
      <div style="display: flex">
        <v-btn dark text @click="deleteRecordFromDB(tempID, true)">Yes</v-btn>
        <v-btn dark text @click="snackBarRemove = false">No</v-btn>
      </div>
    </v-snackbar>

    <v-snackbar
      :timeout="10000"
      style="margin: 20px;; position: absolute; top: 56px"
      v-model="snackBarBackToHangar"
      color="info"
      middle
      top
      multi-line
    >
      Press hangar icon anytime to select another aeroplane
      <v-btn dark text @click="snackBarBackToHangar = false">Close</v-btn>
    </v-snackbar>

    <v-snackbar
      style="margin: 20px"
      :timeout="3000"
      v-model="snackBarLoadSuccess"
      color="success"
      left
      bottom
      multi-line
    >
      {{successText}}
      <v-btn dark text @click="snackBarLoadSuccess = false">Close</v-btn>
    </v-snackbar>
    <v-card style="margin-bottom: 56px">
      <v-card-title>
        <h5>Saved presets</h5>
      </v-card-title>
      <v-card-text>
        <v-list v-if="DB.length" two-line>
          <v-list-item-group>
            <div v-for="saved in DB" :key="saved.id">
              <v-list-item>
                <v-list-item-content>
                  <template v-if="saved.username !== ''">
                    <v-list-item-title v-text="saved.username"></v-list-item-title>
                    <v-list-item-subtitle class="text--primary" v-text="saved.plane"></v-list-item-subtitle>
                  </template>
                  <template v-else>
                    <v-list-item-title v-text="saved.plane"></v-list-item-title>
                  </template>
                  <v-list-item-subtitle
                    class="text--primary"
                    v-text="FlyCalc.dateToString(saved.created_at)"
                  ></v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <div>
                    <v-icon
                      style="margin-right: 10px"
                      @click="deleteRecordFromDB(saved.id, false)"
                    >mdi-delete</v-icon>
                    <v-icon @click="loadDBintoStore(saved.id)">mdi-briefcase-upload</v-icon>
                  </div>
                </v-list-item-action>
              </v-list-item>
            </div>
          </v-list-item-group>
        </v-list>
        <v-alert v-else type="info">No data available</v-alert>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { sync } from "vuex-pathify";
import FlyCalc from "@/modules/calculate.js";

export default {
  components: {
    "flycalc-dynamic-list": () =>
      import(
        /* webpackChunkName: "flycalc-dynamic-list" */ "@/components/dynamicList.vue"
      )
  },
  beforeMount: function() {
    this.onload();
  },
  created() {
    this.loadConfig();
  },
  mounted() {
    this.loadDB();
    if (!localStorage.snackBarBackToHangar) {
      localStorage.snackBarBackToHangar = true;
      this.snackBarBackToHangar = true;
    }
  },
  data() {
    return {
      FlyCalc: FlyCalc,
      plane: null,
      imperialUnits: ["lb", "ft", "inch"],
      metricUnits: ["kg", "m", "cm"],
      doNotDisplay: ["BEWarm", "__ob__"],
      DB: [],
      snackBarRemove: false,
      snackBarLoadSuccess: false,
      snackBarBackToHangar: false,
      successText: "",
      tempID: null
    };
  },

  methods: {
    loadDB() {
      let self = this;
      this.$db.user_config
        .filter(function(data) {
          return data.plane === self.selectedPlane[0];
        })
        .reverse()
        .sortBy("created_at")
        .then(data => {
          this.DB = data;
        });
    },
    deleteRecordFromDB(id, really) {
      if (!really) {
        this.tempID = id;
        this.snackBarRemove = true;
        return;
      }
      this.snackBarRemove = false;
      let self = this;
      this.$db.user_config
        .filter(function(data) {
          return data.id === id;
        })
        .delete()
        .then(function(deleteCount) {
          self.successText = "Preset deleted successfully";
          self.snackBarLoadSuccess = true;
          self.loadDB();
        });
    },
    loadDBintoStore(id) {
      let self = this;
      this.$db.user_config
        .filter(function(data) {
          return data.id === id;
        })
        .toArray()
        .then(data => {
          self.successText = "Preset loaded successfully";
          self.snackBarLoadSuccess = true;
          if (this.$store.state[this.$route.params.plane] === undefined) {
            this.$store.registerModule(this.$route.params.plane, {
              namespaced: true,
              state: {
                WaB: { componentsArray: [], results: {}, chart: null },
                TO: { results: {} },
                cruise: { PERF: { results: {} }, ROC: { results: {} } },
                LD: { results: {} }
              },
              getters: {
                "": state => {
                  return state;
                },
                "W&B": state => {
                  return state.WaB;
                },
                "W&B/componentsArray": state => {
                  return state.WaB.componentsArray;
                },
                "W&B/chart": state => {
                  return state.WaB.chart;
                },
                TO: state => {
                  return state.TO;
                },
                LD: state => {
                  return state.LD;
                },
                "cruise/PERF": state => {
                  return state.cruise.PERF;
                },
                "cruise/ROC": state => {
                  return state.cruise.ROC;
                }
              },
              mutations: {
                [`W&B/results`](state, payload) {
                  state.WaB.results = payload;
                },
                [`W&B/componentsArray`](state, payload) {
                  state.WaB.componentsArray = payload;
                },
                [`W&B/chart`](state, payload) {
                  state.WaB.chart = payload;
                },
                [`TO`](state, payload) {
                  state.TO = payload;
                },
                [`LD`](state, payload) {
                  state.LD = payload;
                },
                [`cruise/PERF`](state, payload) {
                  state.cruise.PERF = payload;
                },
                [`cruise/ROC`](state, payload) {
                  state.cruise.ROC = payload;
                }
              }
            });
          }
          self.$store.state[data[0].plane] = data[0].data;
        });
    },
    onload() {
      this.topNavModel = [true, "plane"];
    },
    loadConfig() {
      import(`@/planes/${this.planeInfo.plane}.js`)
        .then(module => {
          this.plane = module.default;
          if (Object.keys(this.plane).includes(this.planeInfo.config)) {
            this.plane = this.plane[this.planeInfo.config];
          }
          let temp = [];
          temp.push(
            !("WaB" in this.plane && "BEWarm" in this.planeInfo.weight)
          );
          temp.push(!("TO" in this.plane));
          temp.push(!("cruise" in this.plane));
          temp.push(!("LD" in this.plane));
          this.bottomNavDisabled = temp;
          return;
        })
        .catch(err => {
          this.bottomNavDisabled = [true, true, true, true];
        });
    }
  },
  computed: {
    displayInfo() {
      let out = [];
      let temp;
      let objectKeys;
      if (this.planeInfo.weight) {
        objectKeys = Object.getOwnPropertyNames(this.planeInfo.weight);
        for (let i = 0; i < objectKeys.length; i++) {
          if (
            !this.doNotDisplay.includes(objectKeys[i]) &&
            !(typeof this.planeInfo.weight[objectKeys[i]].value === "object")
          ) {
            let value, unit;
            switch (this.planeInfo.weight[objectKeys[i]].unit) {
              case "lb":
                value = Math.round(
                  this.planeInfo.weight[objectKeys[i]].value * 0.45359237
                );
                unit = "kg";
                break;
              case "inch":
                value =
                  Math.round(
                    this.planeInfo.weight[objectKeys[i]].value * 25.4
                  ) / 1000;
                unit = "m";
                break;
              default:
                value = this.planeInfo.weight[objectKeys[i]].value;
                unit = this.planeInfo.weight[objectKeys[i]].unit;
                break;
            }
            out.push({
              name: objectKeys[i],
              value: `${value} ${unit}`
            });
          }
        }
      }
      if (this.planeInfo.info) {
        objectKeys = Object.getOwnPropertyNames(this.planeInfo.info);
        for (let i = 0; i < objectKeys.length; i++) {
          if (typeof this.planeInfo.info[objectKeys[i]] === "string") {
            out.push({
              name: objectKeys[i],
              value: this.planeInfo.info[objectKeys[i]]
            });
          }
        }
      }
      return out;
    },
    planeInfo() {
      return this.json[this.selectedPlane[1]][this.selectedPlane[0]];
    },
    manufacturer() {
      return (
        this.selectedPlane[1].charAt(0).toUpperCase() +
        this.selectedPlane[1].slice(1)
      );
    },
    hangarModel: sync("hangarPanel"),
    topNavModel: sync("topNav"),
    selectedPlane: sync("selectedPlane"),
    bottomNavDisabled: sync("bottomNavDisabled")
  }
};
</script>
