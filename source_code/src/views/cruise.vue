<template>
  <div style="margin-bottom: 56px">
    <v-card style="margin-bottom: 10px">
      <v-card-title style="padding-bottom: 0px">
        <h5>En-route rate of climb</h5>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
            hint="Gross weight"
            type="number"
            label="GW"
            suffix="kg"
            v-model="ROCData.GW"
          ></v-text-field>
          <v-text-field
            type="number"
            label="Pressure altitude"
            suffix="ft"
            v-model="ROCData.pressureAltitude"
          ></v-text-field>
          <v-text-field type="number" label="OAT" suffix="°C" v-model="ROCData.OAT"></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-title style="padding-bottom: 0px">
        <h5>Summary</h5>
      </v-card-title>
      <v-card-text>
        <flycalc-dynamic-list :items="plane.cruise.ROC.conditions"></flycalc-dynamic-list>
        <transition name="fade">
          <flycalc-incomplete-data v-show="ROCprintResults.length === 0"></flycalc-incomplete-data>
        </transition>
        <transition name="fade">
          <div v-show="ROCprintResults.length > 0">
            <v-divider></v-divider>
            <flycalc-dynamic-list :items="ROCprintResults"></flycalc-dynamic-list>
          </div>
        </transition>
      </v-card-text>
    </v-card>
    <v-card>
      <v-card-title>
        <h5>Cruise performance</h5>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
            type="number"
            label="GW"
            suffix="kg"
            hint="Gross Weight"
            v-model="PERFData.GW"
          ></v-text-field>
          <v-select
            suffix="ft"
            :items="Object.keys(plane.cruise.PERF.PERF_table)"
            label="Pressure altitude"
            type="number"
            v-model="PERFData.pressureAltitude"
          ></v-select>
          <v-text-field
            v-if="!(PERFData.pressureAltitude === undefined || PERFData.pressureAltitude === '')"
            label="OAT"
            type="number"
            v-model="PERFData.OAT"
            persistent-hint
            :hint="'ISA ' + ISA(PERFData.pressureAltitude) + '°C'"
            suffix="°C"
          ></v-text-field>
          <v-select
            v-if="!(PERFData.pressureAltitude === undefined || PERFData.pressureAltitude === '')"
            :items="
              Object.keys(plane.cruise.PERF.PERF_table[PERFData.pressureAltitude])
                .sort()
                .reverse()
            "
            type="number"
            label="Propeller RPM"
            v-model="PERFData.RPM"
          ></v-select>
        </v-form>
      </v-card-text>
      <v-card-title style="padding-bottom: 0px">
        <h5>Summary</h5>
      </v-card-title>
      <v-card-text>
        <transition name="fade">
          <div
            style="padding-top: 20px"
            v-show="(PERFData.RPM === undefined || PERFData.RPM === '') || (PERFData.OAT === undefined || PERFData.OAT === '')"
          >
            <flycalc-incomplete-data></flycalc-incomplete-data>
          </div>
        </transition>
        <transition name="fade">
          <div
            v-if="!((PERFData.RPM === undefined || PERFData.RPM === '') || (PERFData.OAT === undefined || PERFData.OAT === ''))"
          >
            <flycalc-dynamic-list :items="PERFPrintResults"></flycalc-dynamic-list>
          </div>
        </transition>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { sync, get, set } from "vuex-pathify";
import FlyCalc from "@/modules/calculate.js";
import nestedObjectAssign from "nested-object-assign";
import { calcMixin } from "@/modules/general.js";

export default {
  mixins: [calcMixin],
  data() {
    return {
      printPDFfunction: null,
      planeInfo: null,
      ROCData: {},
      PERFData: {},
      plane: null,
      TOWvalidation: v =>
        v <= this.planeInfo.weight.MTOW.value ||
        `MTOW: ${this.planeInfo.weight.MTOW.value} ${this.planeInfo.weight.MTOW.unit}`
    };
  },
  created() {
    this.loadConfig();
    this.ROCData = nestedObjectAssign({}, this.ROC.input);
    this.PERFData = nestedObjectAssign({}, this.PERF.input);
  },
  methods: {
    PERFmutate(payload) {
      this.$store.commit(`${this.selectedPlane[0]}/cruise/PERF`, payload);
    },
    ROCmutate(payload) {
      this.$store.commit(`${this.selectedPlane[0]}/cruise/ROC`, payload);
    },
    ISA(pressureAltitude) {
      return FlyCalc.ISA(pressureAltitude);
    }
  },
  computed: {
    ROC: {
      get() {
        if (!this.$store.getters[`${this.selectedPlane[0]}/cruise/ROC`])
          return {};
        return this.$store.getters[`${this.selectedPlane[0]}/cruise/ROC`];
      },
      set(foo) {
        this.ROCmutate(
          nestedObjectAssign(
            {},
            this.$store.getters[`${this.selectedPlane[0]}/cruise/ROC`],
            foo
          )
        );
      }
    },
    PERF: {
      get() {
        if (!this.$store.getters[`${this.selectedPlane[0]}/cruise/PERF`])
          return {};
        return this.$store.getters[`${this.selectedPlane[0]}/cruise/PERF`];
      },
      set(foo) {
        this.PERFmutate(
          nestedObjectAssign(
            {},
            this.$store.getters[`${this.selectedPlane[0]}/cruise/PERF`],
            foo
          )
        );
      }
    },
    ROCprintResults() {
      let tempArray = [];
      let foo = this.ROCresults;
      if (foo.ROC) {
        tempArray.push({ name: "Rate of climb", value: foo.ROC + " ft/min" });
      }
      if (foo.Vy) {
        tempArray.push({ name: "Vy", value: foo.Vy + " kt" });
      }
      return tempArray;
    },
    ROCresults() {
      let tempObject = {};
      let temp;
      let inputData = nestedObjectAssign({}, this.ROCData);
      inputData = FlyCalc.emptyToZero(inputData);
      temp =
        Math.floor(
          this.plane.cruise.ROC.ROC(
            inputData.GW,
            inputData.pressureAltitude,
            inputData.OAT
          ) / 10
        ) * 10;
      if (temp) Object.assign(tempObject, { ROC: temp });
      temp = Math.round(
        this.plane.cruise.ROC.Vy(inputData.GW, inputData.pressureAltitude)
      );
      if (temp) Object.assign(tempObject, { Vy: temp });
      this.ROC = { results: tempObject, input: this.ROCData };
      return tempObject;
    },
    PERFPrintResults() {
      let tempArray = [];
      let foo = this.PERFResults;
      if (foo.KTAS) {
        tempArray.push({ name: "TAS", value: foo.KTAS + " kt" });
      }
      if (foo.fuelConsumption) {
        tempArray.push({
          name: "Fuel consumption",
          value: foo.fuelConsumption + " L/hr"
        });
      }
      if (foo.endurance) {
        tempArray.push({ name: "Endurance", value: foo.endurance });
      }
      if (foo.range) {
        tempArray.push({ name: "Range", value: foo.range + " NM" });
      }
      if (foo.specificRange) {
        tempArray.push({
          name: "Specific range",
          value: foo.specificRange + " NM/L"
        });
      }
      return tempArray;
    },
    PERFResults() {
      let tempObject = {};
      let temp;
      let inputData = nestedObjectAssign({}, this.PERFData);
      inputData = FlyCalc.emptyToZero(inputData);
      temp = Math.round(
        this.plane.cruise.PERF.KTAS(
          inputData.GW,
          inputData.RPM,
          inputData.pressureAltitude,
          inputData.OAT
        )
      );
      if (temp) Object.assign(tempObject, { KTAS: temp });
      temp = Math.round(
        this.plane.cruise.PERF.fuelConsumption(
          inputData.GW,
          inputData.RPM,
          inputData.pressureAltitude,
          inputData.OAT
        )
      );
      if (temp) Object.assign(tempObject, { fuelConsumption: temp });
      temp = this.plane.cruise.PERF.endurance(
        inputData.GW,
        inputData.RPM,
        inputData.pressureAltitude,
        inputData.OAT
      );
      if (temp) Object.assign(tempObject, { endurance: temp });
      temp = Math.round(
        this.plane.cruise.PERF.range(
          inputData.GW,
          inputData.RPM,
          inputData.pressureAltitude,
          inputData.OAT
        )
      );
      if (temp) Object.assign(tempObject, { range: temp });
      temp = Math.round(
        this.plane.cruise.PERF.specificRange(
          inputData.GW,
          inputData.RPM,
          inputData.pressureAltitude,
          inputData.OAT
        )
      );
      if (temp) Object.assign(tempObject, { specificRange: temp });
      this.PERF = { results: tempObject, input: this.PERFData };
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
