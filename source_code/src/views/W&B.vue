<template>
  <div style="margin-bottom: 56px">
    <v-card style="margin-bottom: 10px">
      <v-card-title style="padding-bottom: 0px">
        <h5>Weight and balance</h5>
      </v-card-title>
      <v-card-text>
        <v-form>
          <div v-for="(item, index) in plane.WaB.components" :key="item.name">
            <v-text-field
              type="number"
              :label="item.name"
              :suffix="item.unit"
              v-model="componentsArray[index]"
              :rules="item.rule"
            ></v-text-field>
          </div>
          <v-text-field
            readonly
            :rules="[TOWvalidation]"
            type="number"
            label="TOW"
            suffix="kg"
            :value="computedCG.TOW"
          ></v-text-field>
        </v-form>
      </v-card-text>
    </v-card>
    <transition name="fade">
      <v-card style="margin-bottom: 10px">
        <v-card-title>
          <h5>Summary</h5>
        </v-card-title>
        <v-card-text>
          <flycalc-chart-scatter
            ref="chartComponent"
            style="margin-top: 16px"
            :chart-data="[computedCG.chartData, envelope]"
          ></flycalc-chart-scatter>
          <flycalc-dynamic-list :items="summary"></flycalc-dynamic-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="#063761"
            text
            v-on:click="$refs.chartComponent.saveChart();"
          >Save chart to PDF</v-btn>
        </v-card-actions>
      </v-card>
    </transition>
  </div>
</template>

<script>
import { sync } from "vuex-pathify";
import { uuid } from "vue-idb";

export default {
  components: {
    "flycalc-dynamic-list": () =>
      import(
        /* webpackChunkName: "flycalc-dynamic-list" */ "@/components/dynamicList.vue"
      ),
    "flycalc-tow": () =>
      import(/* webpackChunkName: "flycalc-tow" */ "@/components/tow.vue"),
    "flycalc-rwy-condition": () =>
      import(
        /* webpackChunkName: "flycalc-rwy-condition" */ "@/components/rwy.vue"
      ),
    "flycalc-meteo-condition": () =>
      import(
        /* webpackChunkName: "flycalc-meteo-condition" */ "@/components/meteo.vue"
      ),
    "flycalc-chart-scatter": () =>
      import(
        /* webpackChunkName: "flycalc-chart-scatter" */ "@/components/chartScatter.vue"
      ),
    "flycalc-chart-bar": () =>
      import(
        /* webpackChunkName: "flycalc-chart-bar" */ "@/components/chartBar.vue"
      ),
    "flycalc-incomplete-data": () =>
      import(
        /* webpackChunkName: "flycalc-incomplete-data" */ "@/components/nothingToCalculate.vue"
      )
  },
  data() {
    return {
      planeInfo: null,
      plane: null,
      TOWvalidation: v =>
        v <= this.planeInfo.weight.MTOW.value ||
        `MTOW: ${this.planeInfo.weight.MTOW.value} ${this.planeInfo.weight.MTOW.unit}`
    };
  },
  created() {
    this.loadConfig();
  },
  beforeCreate() {
    if (this.$store.state[this.$route.params.plane] === undefined) {
      this.$store.registerModule(this.$route.params.plane, {
        namespaced: true,
        state: {
          WaB: { componentsArray: [], results: {} },
          TO: {},
          cruise: { PERF: {}, ROC: {} },
          LD: {}
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
  },
  computed: {
    getter() {
      return this.$store.getters[`${this.selectedPlane[0]}/W&B`];
    },
    componentsName() {
      let tempArray = ["BEW"];
      for (let i = 0; i < this.plane.WaB.components.length; i++) {
        tempArray.push(this.plane.WaB.components[i].name);
      }
      return tempArray;
    },
    componentsArray: {
      get() {
        return this.getter.componentsArray;
      },
      set(foo) {
        this.$store.commit(`${this.selectedPlane[0]}/W&B/componentsArray`, foo);
      }
    },
    selectedPlane: sync("selectedPlane"),
    bottomNavDisabled: sync("bottomNavDisabled"),
    computedCG() {
      return this.calculateCG(
        this.planeInfo.weight.BEW.value,
        this.planeInfo.weight.BEWarm.value,
        this.componentsArray,
        this.plane.WaB.components,
        this.componentsName,
        this.plane.WaB.armToMAC
      );
    },
    summary() {
      let summary = [];
      let summaryArray = this.plane.WaB.summary;
      let temp = this.computedCG;
      for (let i = 0; i < summaryArray.length; i++) {
        switch (summaryArray[i]) {
          case "BEW":
            summary.push({
              name: "BEW",
              value: this.planeInfo.weight.BEW.value + " kg"
            });
            break;
          case "TOW":
            summary.push({ name: "TOW", value: temp.TOW + " kg" });
            break;
          case "CG":
            summary.push({
              name: "CG",
              value: temp.CG + " m"
            });
            break;
          case "%MAC":
            summary.push({
              name: "%MAC",
              value: temp.MAC + "%"
            });
            break;
          case "ZFW":
            summary.push({
              name: "ZFW",
              value: temp.ZFW + " kg"
            });
            break;
        }
      }
      return summary;
    },
    envelope() {
      let temp = this.plane.WaB.envelope;
      for (let i = 0; i < temp.length; i++) {
        switch (temp[i].y) {
          case "BEW":
            temp[i].y = this.planeInfo.weight.BEW.value;
            break;
          case "MTOW":
            temp[i].y = this.planeInfo.weight.MTOW.value;
            break;
        }
      }
      return temp;
    }
  },
  methods: {
    saveToIDB() {
      this.$db.user_config.add({
        id: uuid(),
        data: this.$store.getters[`${this.selectedPlane[0]}/`],
        plane: this.selectedPlane[0],
        username: "",
        created_at: new Date()
      });
    },
    calculateZFW(componentsArray, componentsName) {
      let ZFW = 0;
      for (let i = 0; i < componentsArray.length; i++) {
        if (!componentsName[i].toLowerCase().includes("fuel")) {
          ZFW += componentsArray[i].weight;
        }
      }
      return ZFW;
    },
    calculateCG(
      BEW,
      BEWarm,
      componentsArray,
      componentsInfo,
      componentsName,
      armToMAC
    ) {
      let components = [
        {
          weight: BEW,
          arm: BEWarm
        }
      ];
      for (let i = 0; i < componentsArray.length; i++) {
        components.push({
          weight: this.isNumber(componentsArray[i]) * componentsInfo[i].toKg,
          arm: componentsInfo[i].arm
        });
      }
      let weightSum = 0;
      let Moment = 0;
      let CG = 0;
      let tempArray = [];
      for (let i = 0; i < components.length; i++) {
        weightSum += +components[i].weight;
        Moment += +components[i].weight * +components[i].arm;
        CG = +Moment / +weightSum;
        tempArray.push({ x: +CG, y: +weightSum });
      }

      CG = Math.round(CG * 1000) / 1000;
      Moment = Math.round(Moment * 10) / 10;
      let TOW = Math.round(weightSum * 10) / 10;
      let MAC = Math.round(armToMAC(CG) * 1000) / 10;
      let ZFW = this.calculateZFW(components, componentsName);
      this.$store.commit(
        `${this.selectedPlane[0]}/TO`,
        Object.assign({}, this.$store.getters[`${this.selectedPlane[0]}/TO`], {
          weight: { TOW: TOW }
        })
      );
      this.$store.commit(`${this.selectedPlane[0]}/W&B/results`, {
        CG: CG,
        MAC: MAC,
        Moment: Moment,
        ZFW: ZFW,
        TOW: TOW
      });
      return {
        chartData: tempArray,
        CG: CG,
        MAC: MAC,
        Moment: Moment,
        ZFW: ZFW,
        TOW: TOW
      };
    },
    printPDF() {
      console.log("Jdeme printovat... 💩💩");
    },
    isNumber(number) {
      if (+number) return +number;
      return 0;
    },
    loadConfig() {
      this.planeInfo = this.json[this.selectedPlane[1]][this.selectedPlane[0]];
      import(`@/planes/${this.planeInfo.plane}.js`).then(module => {
        this.plane = module.default;
        if (Object.keys(this.plane).includes(this.planeInfo.config)) {
          this.plane = this.plane[this.planeInfo.config];
        }
        let temp = [];
        temp.push(!("WaB" in this.plane));
        temp.push(!("TO" in this.plane));
        temp.push(!("cruise" in this.plane));
        temp.push(!("LD" in this.plane));
        this.bottomNavDisabled = temp;
        return;
      });
    }
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.2s;
}

.fade-enter-active {
  transition-delay: 0.2s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
