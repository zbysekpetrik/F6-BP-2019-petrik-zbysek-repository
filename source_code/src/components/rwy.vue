<template>
  <v-card style="margin-bottom: 10px">
    <v-card-title style="padding-bottom: 0px">
      <h5>Runway</h5>
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-select
          type="text"
          v-model="data.selectedRWY"
          :items="displayRWY"
          @change="selectedRWY()"
          label="RWY"
        >
          <template v-slot:no-data>
            <v-list-item>
              <v-list-item-content>RWY is not in database. Please select Custom RWY</v-list-item-content>
            </v-list-item>
          </template>
        </v-select>
        <div v-show="data.selectedRWY === 'Custom'">
          <v-text-field
            type="number"
            :label="!customRWYmagXdes ? 'RWY designator': 'RWY heading'"
            v-mask="!customRWYmagXdes ? '##': '###'"
            v-model="data.customRWY"
            :rules="[customRWYerror]"
            :class="{warn: customRWYerror}"
            :suffix="!customRWYmagXdes ? '': '°'"
            @input="customRWYchange()"
          >
            <v-icon
              @click="customRWYmagXdes = !customRWYmagXdes; customRWYchange()"
              slot="append"
              :class="{ 'rotateArrow': customRWYmagXdes }"
            >mdi-swap-horizontal</v-icon>
          </v-text-field>
        </div>

        <template v-if="takeoff !== undefined">
          <v-text-field type="number" label="TODA" suffix="m" @input="change()" v-model="data.TODA"></v-text-field>
          <v-text-field type="number" label="TORA" suffix="m" @input="change()" v-model="data.TORA"></v-text-field>
        </template>
        <template v-if="landing !== undefined">
          <v-text-field type="number" label="LDA" suffix="m" @input="change()" v-model="data.LDA"></v-text-field>
        </template>

        <v-text-field type="number" label="RWY Slope" suffix="%" @input="change()" v-model="slope">
          <v-icon
            slot="append"
            @click="slopeExpand = !slopeExpand"
            :class="{ 'rotateArrow': slopeExpand }"
          >mdi-menu-down</v-icon>
        </v-text-field>
        <div v-show="slopeExpand" style="padding-left: 10px">
          <v-text-field
            type="number"
            label="THR ELEV"
            suffix="ft"
            @input="change()"
            v-model="data.THR_ELEV"
          ></v-text-field>
          <v-text-field
            type="number"
            label="DER ELEV"
            suffix="ft"
            @input="change()"
            v-model="data.DER_ELEV"
          ></v-text-field>
        </div>
        <v-text-field
          type="number"
          label="AD Elevation"
          suffix="ft"
          @input="change()"
          v-model="data.AD_ELEV"
        ></v-text-field>
        <v-select
          :items="['Paved', 'Grass']"
          label="RWY Surface"
          @change="change()"
          v-model="data.surface"
        ></v-select>
        <v-select
          :items="['Dry', 'Slippery / Wet', 'Mud', 'Snow ( up to 5 cm )', 'Slush']"
          label="RWY Condition"
          @change="change()"
          v-model="data.contamination"
        ></v-select>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { dirname } from "path";
import { mask } from "vue-the-mask";

export default {
  directives: {
    mask
  },
  props: ["takeoff", "landing", "inputData"],
  created() {
    this.data = this.inputData;
    this.slope = this.data.slope;
    this.customRWYmagXdes = this.inputData.customRWYmagXdes;
  },
  data: function() {
    return {
      data: {},
      selectMenu: false,
      slopeExpand: false,
      customRWYmagXdes: false,
      slope: ""
    };
  },
  computed: {
    displayRWY() {
      let temp = Object.keys(this.RWY);
      temp.unshift("Custom");
      return temp;
    },
    customRWYerror() {
      if (!this.data.customRWY) return false;
      if (this.data.customRWY.length < 2 && !this.customRWYmagXdes) {
        return "Enter RWY designator in 2 digits format";
      } else if (this.data.customRWY.length < 3 && this.customRWYmagXdes) {
        return "Enter RWY heading in 3 digits format";
      } else return false;
    }
  },
  methods: {
    customRWYchange() {
      this.data.RWYdirection = this.customRWYmagXdes
        ? this.data.customRWY
        : this.data.customRWY * 10;
      this.data.customRWYmagXdes = this.customRWYmagXdes;
      this.change();
    },
    RWY_SLOPE(DER_ELEV, THR_ELEV, distance) {
      let slope = +DER_ELEV - +THR_ELEV;
      slope /= +distance / 0.305;
      slope *= 100;
      if (isNaN(slope)) return "";
      return Math.round(slope * 100) / 100;
    },
    selectedRWY() {
      let foo = this.data.selectedRWY;
      if (foo === "Custom") {
        this.data.RWYdirection = "";
        this.data.TORA = "";
        this.data.TODA = "";
        this.data.LDA = "";
        this.data.THR_ELEV = "";
        this.data.DER_ELEV = "";
        this.data.AD_ELEV = "";
        this.data.surface = "";
        this.data.contamination = "";
        this.data.slope = "";
        return;
      }
      if (isNaN(foo)) {
        if (this.RWY[foo] !== undefined) {
          this.data.RWYdirection = this.RWY[foo].direction;
          this.data.TORA = this.RWY[foo].TORA;
          this.data.TODA = this.RWY[foo].TODA;
          this.data.LDA = this.RWY[foo].LDA;
          if (
            +this.RWY[foo]["THR ELEV"][this.takeoff !== undefined ? "TO" : "LD"]
          ) {
            this.data.THR_ELEV = this.RWY[foo]["THR ELEV"][
              this.takeoff !== undefined ? "TO" : "LD"
            ];
          } else {
            this.data.THR_ELEV = this.RWY[foo]["THR ELEV"];
          }
          if (
            +this.RWY[foo]["DER ELEV"][this.takeoff !== undefined ? "TO" : "LD"]
          ) {
            this.data.DER_ELEV = this.RWY[foo]["DER ELEV"][
              this.takeoff !== undefined ? "TO" : "LD"
            ];
          } else {
            this.data.DER_ELEV = this.RWY[foo]["DER ELEV"];
          }
          this.data.AD_ELEV = this.RWY[foo]["AD ELEV"];
          this.data.surface = this.RWY[foo]["SURFACE"];
        }
      } else {
        this.data.RWYdirection = +foo * 10;
      }
      this.change();
    },
    change() {
      if (
        (+this.data.THR_ELEV || +this.data.THR_ELEV == 0) &&
        (+this.data.DER_ELEV || +this.data.THR_ELEV == 0) &&
        (+this.takeoff !== undefined
          ? this.data.TORA
          : this.data.LDA || +this.takeoff !== undefined
          ? this.data.TORA
          : this.data.LDA == 0)
      ) {
        this.data.slope = this.RWY_SLOPE(
          this.data.DER_ELEV,
          this.data.THR_ELEV,
          this.takeoff !== undefined ? this.data.TORA : this.data.LDA
        );
        this.slope = this.data.slope;
      }
      this.$emit("change", this.data);
    }
  },
  watch: {
    inputData() {
      if (this.data === this.inputData) return;
      this.data = this.inputData;
      this.slope = this.data.slope
      this.customRWYmagXdes = this.inputData.customRWYmagXdes;
    }
  }
};
</script>

<style>
.rotateArrow {
  transform: rotate(180deg);
}

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