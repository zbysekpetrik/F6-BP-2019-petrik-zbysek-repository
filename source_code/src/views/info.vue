<template>
  <div>
    <v-card style="margin-bottom: 56px">
      <v-img v-bind:src="planeInfo.img"></v-img>
      <div style="padding:0px">
        <v-card>
          <v-card-title style="display: flex; justify-content: space-between;">
            <h5>{{manufacturer}} {{planeInfo.plane}}</h5>
            <h5>{{selectedPlane[0]}}</h5>
          </v-card-title>
          <v-divider></v-divider>
          <flycalc-dynamic-list v-if="planeInfo.info !== undefined" :items="displayInfo"></flycalc-dynamic-list>
        </v-card>
        <div style="text-align:center;"></div>
      </div>
    </v-card>
  </div>
</template>

<script>
import { sync } from "vuex-pathify";

export default {
  components: {
    "flycalc-dynamic-list": () => import(/* webpackChunkName: "flycalc-dynamic-list" */"@/components/dynamicList.vue"),
  },
  beforeMount: function() {
    this.onload();
  },
  created() {
    this.loadConfig();
  },
  data() {
    return {
      plane: null,
      imperialUnits: ["lb", "ft", "inch"],
      metricUnits: ["kg", "m", "cm"],
      doNotDisplay: ["BEWarm", "__ob__"]
    };
  },

  methods: {
    onload() {
      this.topNavModel = [true, "plane"];
    },
    loadConfig() {
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
  },
  computed: {
    displayInfo() {
      let out = [];
      let temp;
      let objectKeys = Object.getOwnPropertyNames(this.planeInfo.weight);
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
                Math.round(this.planeInfo.weight[objectKeys[i]].value * 25.4) /
                1000;
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
      objectKeys = Object.getOwnPropertyNames(this.planeInfo.info);
      for (let i = 0; i < objectKeys.length; i++) {
        if (typeof this.planeInfo.info[objectKeys[i]] === "string") {
          out.push({
            name: objectKeys[i],
            value: this.planeInfo.info[objectKeys[i]]
          });
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
