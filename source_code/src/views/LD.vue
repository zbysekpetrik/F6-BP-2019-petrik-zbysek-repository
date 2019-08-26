<template>
  <div style="margin-bottom: 56px">
    <flycalc-rwy-condition landing :input-data="rwyData" @change="rwyChange"></flycalc-rwy-condition>
    <flycalc-meteo-condition
      :input-data="meteoData"
      :rwy-direction="rwyData.RWYdirection"
      @change="meteoChange"
    ></flycalc-meteo-condition>
    <v-card>
      <v-card-title style="padding-bottom: 0px">
        <h5>Summary</h5>
      </v-card-title>
      <v-card-text>
        <flycalc-dynamic-list :items="plane.LD.conditions"></flycalc-dynamic-list>
        <transition name="fade">
          <flycalc-incomplete-data v-show="printResults.length === 0"></flycalc-incomplete-data>
        </transition>
        <transition name="fade">
          <div v-show="printResults.length > 0">
            <v-divider v-show="printResults.length > 0"></v-divider>
            <flycalc-dynamic-list :items="printResults"></flycalc-dynamic-list>
          </div>
        </transition>
        <transition name="fade">
          <flycalc-chart-bar
            :chart-data="chartData.data"
            :chart-labels="chartData.labels"
            :chart-colors="chartData.colors"
            :color-mode="$vuetify.theme.dark"
            v-show="chartData.show"
          ></flycalc-chart-bar>
        </transition>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { sync } from "vuex-pathify";
import FlyCalc from "@/modules/calculate.js";
import {calcMixin} from "@/modules/general.js"

export default {
  mixins: [calcMixin],
  data() {
    return {
      printPDFfunction: null,
      planeInfo: null,
      plane: null
    };
  },
  created() {
    this.loadConfig();
  },
  methods: {
    rwyChange(foo) {
      this.rwyData = foo;
    },
    meteoChange(foo) {
      this.meteoData = foo;
    },
    mutate(payload) {
      this.$store.commit(`${this.selectedPlane[0]}/LD`, payload);
    }
  },
  computed: {
    getter() {
      return this.$store.getters[`${this.selectedPlane[0]}/LD`];
    },
    rwyData: {
      get() {
        if (!this.getter.rwy) return {};
        return this.getter.rwy;
      },
      set(foo) {
        foo = FlyCalc.emptyToZero(foo);
        foo = { rwy: foo };
        this.mutate(Object.assign({}, this.getter, foo));
      }
    },
    meteoData: {
      get() {
        if (!this.getter.meteo) return {};
        return this.getter.meteo;
      },
      set(foo) {
        foo = FlyCalc.emptyToZero(foo);
        foo = { meteo: foo };
        this.mutate(Object.assign({}, this.getter, foo));
      }
    },
    printResults() {
      let tempArray = [];
      let foo = this.results;
      if (foo.LD) {
        tempArray.push({ name: "LD", value: foo.LD + " m" });
      }
      if (foo.LR) {
        tempArray.push({ name: "LR", value: foo.LR + " m" });
      }
      return tempArray;
    },
    chartData() {
      let labels = ["LDA", "LD", "LR"];
      let colors = ["royalblue", "orange", "green", "purple"];
      let data = [this.rwyData.LDA, this.results.LD, this.results.LR];
      if (!this.results.LR)
        return { labels: labels, colors: colors, data: data, show: false };
      return { labels: labels, colors: colors, data: data, show: true };
    },
    results() {
      let tempObject = {};
      let temp;
      temp =
        Math.ceil(
          this.plane.LD.LRcorrected(
            this.rwyData.AD_ELEV,
            this.rwyData.slope,
            this.meteoData.OAT,
            this.meteoData.QNH,
            this.meteoData.HW,
            this.rwyData.surface,
            this.rwyData.contamination
          ) / 10
        ) * 10;
      if (temp) Object.assign(tempObject, { LR: temp });
      temp =
        Math.ceil(
          this.plane.LD.LDcorrected(
            this.rwyData.AD_ELEV,
            this.rwyData.slope,
            this.meteoData.OAT,
            this.meteoData.QNH,
            this.meteoData.HW,
            this.rwyData.surface,
            this.rwyData.contamination
          ) / 10
        ) * 10;
      if (temp) Object.assign(tempObject, { LD: temp });
      this.mutate(Object.assign({}, this.getter, { results: tempObject }));
      return tempObject;
    },
    selectedPlane: sync("selectedPlane"),
    bottomNavDisabled: sync("bottomNavDisabled")
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
