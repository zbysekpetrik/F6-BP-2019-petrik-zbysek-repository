<template>
  <v-card style="margin-bottom: 10px">
    <v-card-title style="padding-bottom: 0px">
      <h5>Meteo</h5>
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-text-field
          type="text"
          inputmode="numeric"
          label="Wind"
          suffix="° / kt"
          v-mask="windMask"
          :hint="windHint"
          persistent-hint
          clearable
          v-model="data.wind"
          :rules="[xWindRule]"
          :class="{ warn: windWarn }"
          :success="windSuccess"
          @input="change()"
        ></v-text-field>
        <v-text-field
          type="number"
          label="OAT"
          suffix="°C"
          clearable
          v-model="data.OAT"
          :class="{ warn: this.data.OAT >= 25 }"
          :error="this.data.OAT >= 25"
          :success="this.data.OAT < 25 && this.data.OAT !== null"
          @input="change()"
        ></v-text-field>
        <v-text-field type="number" clearable label="QNH" suffix="hPa" v-model="data.QNH" @input="change()"></v-text-field>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { mask } from "vue-the-mask";

export default {
  directives: {
    mask
  },
  created() {
    this.data = this.inputData;
    this.data.QNH = 1013.25;
    this.change();
  },
  props: ["inputData", "rwyDirection"],
  data() {
    return {
      data: {},
      xWindRule: false,
      windSuccess: false,
      windWarn: false,
      tempWarn: false,
      windMask: "### / ##",
      windCalculated: null,
      windHint: ""
    };
  },
  methods: {
    change(foo) {
      foo = this.data;
      this.calculateWind(foo.wind, this.rwyDirection);
      this.$emit("change", foo);
    },
    calculateWind(windString, rwyDirection) {
      if (!windString) return;
      if (!rwyDirection) rwyDirection = 0;
      if (windString.length < 7) {
        this.data.HW = null;
        this.data.XW = null;
        this.xWindRule = true;
        this.windWarn = false;
        this.windSuccess = false;
        this.windHint = "";
        return;
      }
      let outString;
      let direction = +windString.slice(0, 3);
      let velocity = +windString.slice(6, 8);
      let a = direction - rwyDirection;
      a = ((a + 180) % 360) - 180;
      let crossWind =
        Math.round(Math.abs(+velocity * Math.sin((a * Math.PI) / 180)) * 100) /
        100;
      let headWind =
        Math.round(Math.abs(+velocity * Math.cos((a * Math.PI) / 180)) * 100) /
        100;
      outString = "( ";
      outString += headWind;
      if (Math.abs(a) < 90) {
        outString += " HW / ";
      } else {
        outString += " TW / ";
        headWind *= -1;
      }
      outString += crossWind;
      if (a > 0) {
        outString += " RXW ) KT";
      } else if (a < 0) {
        outString += " LXW ) KT";
        crossWind *= -1;
      } else {
        outString += " XW ) KT";
      }
      this.windHint = outString;
      this.data.HW = headWind;
      this.data.XW = crossWind;
      if (Math.abs(this.data.XW) > 15) {
        this.xWindRule = outString;
        this.windWarn = false;
        this.windSuccess = false;
      } else if (
        Math.abs(this.data.XW) > 4 ||
        this.data.HW < 0 ||
        this.data.HW > 20
      ) {
        this.xWindRule = outString;
        this.windWarn = true;
        this.windSuccess = false;
      } else {
        this.xWindRule = true;
        this.windSuccess = true;
      }
    }
  },
  watch: {
    rwyDirection() {
      this.calculateWind(this.data.wind, this.rwyDirection);
    },
    inputData() {
      if (this.data === this.inputData) return;
      this.data = this.inputData;
    }
  }
};
</script>

<style>
.warn .error--text {
  color: #fb8c00 !important;
  caret-color: #fb8c00 !important;
}
.warn.error--text {
  color: #fb8c00 !important;
  caret-color: #fb8c00 !important;
}

.err .error--text {
  color: #ff5252 !important;
  caret-color: #ff5252 !important;
}
.err.error--text {
  color: #ff5252 !important;
  caret-color: #ff5252 !important;
}
</style>
