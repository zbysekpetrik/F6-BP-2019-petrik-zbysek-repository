<template>
  <v-card style="margin-bottom: 10px">
    <v-card-title style="padding-bottom: 0px">
      <h5>Runway</h5>
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-combobox
          type="text"
          v-model="data.selectedRWY"
          :items="Object.keys(RWY)"
          @change="selectedRWY()"
          label="RWY Designator"
          :search-input.sync="search"
        >
          <template v-slot:no-data>
            <v-list-item>
              <v-list-item-content>
                No RWY matching.
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-combobox>

        <template v-if="takeoff !== undefined">
          <v-text-field type="number" label="TODA" suffix="m" @input="change()" v-model="data.TODA"></v-text-field>
          <v-text-field type="number" label="TORA" suffix="m" @input="change()" v-model="data.TORA"></v-text-field>
        </template>
        <template v-if="landing !== undefined">
          <v-text-field type="number" label="LDA" suffix="m" @input="change()" v-model="data.LDA"></v-text-field>
        </template>

        <v-text-field
          type="number"
          label="RWY Slope"
          suffix="%"
          @input="change()"
          v-model="data.slope"
        >
          <v-icon
            slot="append"
            :color="slopeExpand ? 'primary' : undefined"
            @click="slopeExpand = !slopeExpand"
            v-text="slopeExpand ? 'mdi-menu-up' : 'mdi-menu-down'"
          ></v-icon>
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
          @input="change()"
          v-model="data.surface"
        ></v-select>
        <v-select
          :items="['Dry', 'Slippery / Wet', 'Mud', 'Snow ( up to 5 cm )', 'Slush']"
          label="RWY Condition"
          @input="change()"
          v-model="data.contamination"
        ></v-select>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { dirname } from "path";
export default {
  props: ["takeoff", "landing", "inputData"],
  created() {
    this.data = this.inputData;
    this.selectedRWY();
  },
  data: function() {
    return {
      data: {},
      selectMenu: false,
      slopeExpand: false
    };
  },
  methods: {
    RWY_SLOPE(DER_ELEV, THR_ELEV, distance) {
      let slope = +DER_ELEV - +THR_ELEV;
      slope /= distance / 0.305;
      slope *= 100;
      if (isNaN(slope)) return "";
      return Math.round(slope * 100) / 100;
    },
    selectedRWY() {
      let foo = this.data.selectedRWY;
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
    change(foo) {
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
      }
      foo = this.data;
      this.$emit("change", foo);
    }
  },
  watch: {
    inputData() {
      if (this.data === this.inputData) return;
      this.data = this.inputData;
    }
  }
};
</script>
