<template>
  <div style="margin-bottom: 56px">
    <flycalc-tow :tow="planeInfo.weight.MTOW.value" :bew="planeInfo.weight.BEW.value" :input-data="weightData" @change="weightChange"></flycalc-tow>
    <flycalc-rwy-condition takeoff :input-data="rwyData" @change="rwyChange"></flycalc-rwy-condition>
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
        <flycalc-dynamic-list :items="plane.TO.conditions"></flycalc-dynamic-list>
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
import { calcMixin } from "@/modules/general.js";

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
    weightChange(foo) {
      this.weightData = foo;
    },
    rwyChange(foo) {
      this.rwyData = foo;
    },
    meteoChange(foo) {
      this.meteoData = foo;
    },
    mutate(payload) {
      this.$store.commit(`${this.selectedPlane[0]}/TO`, payload);
    }
  },
  computed: {
    getter() {
      return this.$store.getters[`${this.selectedPlane[0]}/TO`];
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
    weightData: {
      get() {
        if (!this.getter.weight) return {};
        return this.getter.weight;
      },
      set(foo) {
        foo = FlyCalc.emptyToZero(foo);
        foo = { weight: foo };
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
      if (foo.TOR) {
        tempArray.push({ name: "TOR", value: foo.TOR + " m" });
      }
      if (foo.TOD) {
        tempArray.push({ name: "TOD", value: foo.TOD + " m" });
      }
      if (foo.climb) {
        tempArray.push({
          name: "Take-off rate of climb",
          value: foo.climb + " ft/min"
        });
      }
      if (foo.Vy) {
        tempArray.push({ name: "Vy", value: foo.Vy + " KIAS" });
      }
      return tempArray;
    },
    chartData() {
      let labels = ["TORA", "TOR", "TODA", "TOD"];
      let colors = ["royalblue", "orange", "green", "purple"];
      let data = [
        this.rwyData.TORA,
        this.results.TOR,
        this.rwyData.TODA,
        this.results.TOD
      ];
      if (!this.results.TOR)
        return { labels: labels, colors: colors, data: data, show: false };
      return { labels: labels, colors: colors, data: data, show: true };
    },
    results() {
      let tempObject = {};
      let temp;
      temp =
        Math.ceil(
          this.plane.TO.TORcorrected(
            this.weightData.TOW,
            this.rwyData.AD_ELEV,
            this.rwyData.slope,
            this.meteoData.OAT,
            this.meteoData.QNH,
            this.meteoData.HW,
            this.rwyData.surface,
            this.rwyData.contamination
          ) / 10
        ) * 10;
      if (temp) Object.assign(tempObject, { TOR: temp });
      temp =
        Math.ceil(
          this.plane.TO.TODcorrected(
            this.weightData.TOW,
            this.rwyData.AD_ELEV,
            this.rwyData.slope,
            this.meteoData.OAT,
            this.meteoData.QNH,
            this.meteoData.HW,
            this.rwyData.surface,
            this.rwyData.contamination
          ) / 10
        ) * 10;
      if (temp) Object.assign(tempObject, { TOD: temp });
      temp = Math.floor(
        this.plane.TO.climb(
          this.weightData.TOW,
          this.rwyData.AD_ELEV,
          this.meteoData.OAT,
          this.meteoData.QNH
        )/10
      )*10;
      if (temp) Object.assign(tempObject, { climb: temp });
      temp = Math.round(
        this.plane.TO.Vy(
          this.weightData.TOW,
          this.rwyData.AD_ELEV,
          this.meteoData.QNH
        )
      );
      if (temp) Object.assign(tempObject, { Vy: temp });
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
