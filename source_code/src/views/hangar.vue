<template>
  <div>
    <transition name="fade"></transition>
    <v-card v-if="!true" style="margin-bottom: 10px">
      <v-card-title>
        <h5>Select plane</h5>
      </v-card-title>
      <v-card-text>
        <v-autocomplete
          v-model="autoCompleteModel"
          auto-select-first
          label="Aircraft registration"
          :items="autoCompleteItem"
        ></v-autocomplete>
        <div style="text-align: center">
          <v-btn
            rounded
            color="primary"
            :disabled="!autoCompleteItem.includes(autoCompleteModel)"
            v-on:click="planeClick(autoCompleteModel, null)"
          >
            <v-icon>mdi-arrow-right</v-icon>
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
    <v-expansion-panels multiple accordion v-if="true" class="bottomMargin">
      <v-expansion-panel v-for="manu in Object.keys(json)" :key="manu.id">
        <v-expansion-panel-header>{{manu.charAt(0).toUpperCase() + manu.slice(1)}}</v-expansion-panel-header>
        <v-expansion-panel-content style="text-align:center">
          <v-btn
            style="margin: 0px 10px 20px 0px; width: 40%"
            v-for="plane in Object.keys(json[manu])"
            :key="plane.id"
            v-on:click="planeClick(plane, manu)"
            rounded
            color="primary"
            dark
          >{{ plane }}</v-btn>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import { sync } from "vuex-pathify";
export default {
  mounted: function() {
    this.onload();
  },
  data() {
    return {
      hangar: [],
      infoModel: null,
      autoCompleteModel: null,
    };
  },
  methods: {
    planeClick(foo, bar) {
      if (bar === null) {
        let manuArray = Object.keys(this.json);
        for (let i = 0; i < manuArray.length; i++) {
          if (Object.keys(this.json[manuArray[i]]).includes(foo)) {
            bar = manuArray[i];
          }
        }
      }
      this.$store.set("lastPlane", foo);
      this.$router.push("/" + foo);
    },
    onload() {
      this.topNavModel = [true, "hangar"];
    }
  },
  computed: {
    autoCompleteItem() {
      let array = [];
      let manuArray = Object.keys(this.json);
      for (let i = 0; i < manuArray.length; i++) {
        array = array.concat(Object.keys(this.json[manuArray[i]]));
      }
      return array;
    },
    hangarModel: sync("hangarPanel"),
    topNavModel: sync("topNav")
  }
};
</script>

<style>
.kareta {
  height: 41px;
}

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

.v-item-group.v-bottom-nav .v-btn--active {
  padding-top: 6px;
}

.bottomMargin {
  margin-bottom: 56px;
}
</style>
