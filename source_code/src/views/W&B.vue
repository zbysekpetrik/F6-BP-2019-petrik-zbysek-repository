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
            :color-mode="$vuetify.theme.dark"
            :chart-data="[computedCG.chartData, envelope]"
          ></flycalc-chart-scatter>
          <flycalc-dynamic-list :items="summary"></flycalc-dynamic-list>
        </v-card-text>
      </v-card>
    </transition>
  </div>
</template>

<script>
import { sync } from "vuex-pathify";
import { calcMixin } from "@/modules/general.js";

export default {
  mixins: [calcMixin],
  data() {
    return {
      printPDFfunction: null,
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
  computed: {
    componentsName() {
      let tempArray = ["BEW"];
      for (let i = 0; i < this.plane.WaB.components.length; i++) {
        tempArray.push(this.plane.WaB.components[i].name);
      }
      return tempArray;
    },
    componentsArray: {
      get() {
        return this.$store.getters[
          `${this.selectedPlane[0]}/W&B/componentsArray`
        ];
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
    isNumber(number) {
      if (+number) return +number;
      return 0;
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
