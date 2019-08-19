<template>
  <v-app>
    <flycalc-top-nav :middle-value="middleValue" @plane-click="planeClick"></flycalc-top-nav>

    <v-layout row justify-center>
      <v-flex xs12 sm10 md7 lg6 xl5>
        <div style="padding: 10px 18px 10px 18px !important; z-index: 10">
          <transition name="fade">
            <router-view ref="routerComponent"></router-view>
          </transition>
        </div>
      </v-flex>
    </v-layout>

    <v-btn v-if="false" style="z-index: 1000" @click="addToIDB()">efcecedcčtfsed</v-btn>

    <v-snackbar
      :timeout="3000"
      style="margin: 20px"
      v-model="snackBarSoon"
      color="info"
      left
      bottom
      multi-line
    >
      Available soon ✈
      <v-btn dark text @click="snackBarSoon = false">Close</v-btn>
    </v-snackbar>

    <flycalc-snackbar-ios v-if="snackBariOS" @click="snackBariOS = false"></flycalc-snackbar-ios>

    <div style="z-index: 20" class="tabDiv">
      <transition name="fade">
        <v-tabs v-if="tabShow" centered v-model="tabModel">
          <v-tabs-slider style="height: 3px" v-show="tabModel > 0"></v-tabs-slider>
          <v-tab disabled class="invisibleTab"></v-tab>
          <v-tab
            :disabled="bottomNavDisabled[0]"
            class="tabCustom"
            v-on:click="calcClick('W&B', bottomNavDisabled[0])"
          >
            <v-img max-height="35px" max-width="35px" src="/img/icons/com.svg"></v-img>
          </v-tab>

          <v-tab
            :disabled="bottomNavDisabled[1]"
            class="tabCustom"
            v-on:click="calcClick('T-O', bottomNavDisabled[1])"
          >
            <v-img max-height="35px" max-width="35px" src="/img/icons/takeoff.svg"></v-img>
          </v-tab>

          <v-tab
            :disabled="bottomNavDisabled[2]"
            class="tabCustom"
            v-on:click="calcClick('cruise', bottomNavDisabled[2])"
          >
            <v-img max-height="35px" max-width="35px" src="/img/icons/cruise.svg"></v-img>
          </v-tab>

          <v-tab
            :disabled="bottomNavDisabled[3]"
            class="tabCustom"
            v-on:click="calcClick('LD', bottomNavDisabled[3])"
          >
            <v-img max-height="35px" max-width="35px" src="/img/icons/landing.svg"></v-img>
          </v-tab>
        </v-tabs>
        <v-tabs
          v-else
          class="v-tabs v-tabs-bar"
          style=" z-index: 2; display: grid; text-align: center; height: 48px; -webkit-box-shadow: 0 3px 14px 2px rgba(0,0,0,.12); box-shadow: 0 3px 14px 2px rgba(0,0,0,.12);position: fixed; bottom: 0px; right: 0px; left: 0px"
        >
          <p
            class="unselectable"
            style="margin: auto; color: grey; font-size: 13px"
          >For internal use within F AIR operations only.</p>
        </v-tabs>
      </transition>
    </div>
    <transition name="fade">
      <v-overlay style="z-index: 100" :value="overlayInfo">
        <v-card style="margin: 10px; overflow-x: hidden; overflow-y: auto; max-height: 85vh">
          <v-card-title>
            <h5>Information</h5>
          </v-card-title>
          <v-card-content>
            <div style="padding: 10px">
              <v-alert prominent type="success">Effectivity: 1 SEP 19</v-alert>
              <v-alert v-model="iPhone" type="info" prominent transition="scale-transition">
                To install the app on your iOS device in Safari: tap
                <v-img
                  style="height: 20px; width: 15px; display: inline-block;"
                  src="/img/icons/icon-share.png"
                ></v-img>&nbsp;and then Add to Home Screen
              </v-alert>
              <v-alert
                type="info"
                prominent
              >This application is only supportive tool for W&B and performance calculations.</v-alert>
              <v-alert
                type="info"
                prominent
              >PIC is obliged to make W&B and performance calculations based on certified POH/AFM of particular aircraft.</v-alert>
              <v-alert
                prominent
                type="info"
              >All presented performance data based on proper pilot technique.</v-alert>
              <v-alert
                type="warning"
                prominent
              >Orange color coding represents value exceeding VFR solo SOP limit. Proceed with caution!</v-alert>
              <v-alert
                type="error"
                prominent
              >Red color coding represents value exceeding aircraft certification and/or published AFM data.</v-alert>
              <div style="text-align: right">
                <v-btn color="primary" v-on:click="overlayInfo = false">Close</v-btn>
              </div>
            </div>
          </v-card-content>
        </v-card>
      </v-overlay>
    </transition>
    <transition name="fade">
      <v-overlay style="z-index: 100" :value="overlaySaveName">
        <v-card style="background-color: #512DA8 !important">
          <v-card-title style="background-color: #311B92 !important">
            <h5>Name</h5>
          </v-card-title>
          <v-card-text style="padding: 20px">
            <v-text-field v-model="saveName"></v-text-field>
          </v-card-text>
          <v-card-actions style="text-align: right; display: block !important">
            <v-btn text dark @click="overlaySaveName = false">Cancel</v-btn>
            <v-btn text dark @click="$refs.routerComponent.saveToIDB(saveName); overlaySaveName = false; saveName = ''">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-overlay>
    </transition>
    <v-speed-dial
      style="position: fixed; bottom: 68px; right: 20px; z-index: 99"
      direction="top"
      transition="scale-transition"
      v-model="fabModel"
    >
      <template v-slot:activator>
        <v-btn style="opacity: 0.7" class="fabSize" color="secondary" dark fab>
          <v-icon :class="{ cancelFab: fabModel }">mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-btn color="info" fab dark v-on:click="overlayInfo = true" class="fabSize">
        <v-icon>mdi-information</v-icon>
      </v-btn>
      <v-btn
        :color="!$vuetify.theme.dark ? '#063761' : '#063761'"
        v-on:click="darkMode = !darkMode"
        fab
        dark
        class="fabSize"
      >
        <v-icon>mdi-theme-light-dark</v-icon>
      </v-btn>
      <template v-if="tabModel > 0">
        <v-btn color="purple" @click="overlaySaveName = true" fab dark class="fabSize">
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
        <v-btn color="success" @click="print()" fab dark class="fabSize">
          <v-icon>mdi-printer</v-icon>
        </v-btn>
      </template>
    </v-speed-dial>
  </v-app>
</template>
<script>
import { sync } from "vuex-pathify";

export default {
  name: "App",
  components: {
    "flycalc-top-nav": () =>
      import(
        /* webpackChunkName: "flycalc-top-nav" */ "@/components/topNav.vue"
      ),
    "flycalc-snackbar-ios": () =>
      import(
        /* webpackChunkName: "flycalc-snackBar-iOS" */ "@/components/snackBar_iOS.vue"
      )
  },
  data() {
    return {
      snackBarSoon: false,
      snackBariOS: false,
      fabModel: false,
      overlayInfo: false,
      darkMode: false,
      iPhone: false,
      overlaySaveName: false,
      saveName: ""
    };
  },
  created() {
    this.onload();
    if (localStorage.darkMode) {
      this.darkMode = localStorage.darkMode == "true";
    }
    if (this.isIos() && !this.isInStandaloneMode()) {
      if (!localStorage.promt_iOS) {
        localStorage.promt_iOS = true;
        this.snackBariOS = true;
      }
      this.iPhone = true;
    }
  },
  beforeUpdate() {
    this.onload();
  },
  watch: {
    darkMode(newName) {
      localStorage.darkMode = this.darkMode;
      this.darkModeSwitch(this.darkMode);
    }
  },
  methods: {
    print() {
      this.$refs.routerComponent.printPDF();
    },
    save() {
      this.$refs.routerComponent.saveToIDB();
    },
    darkModeSwitch(darkMode) {
      this.$vuetify.theme.dark = darkMode;
      let metaThemeColor = document.querySelector("meta[name=theme-color]");
      metaThemeColor.setAttribute("content", darkMode ? "#1c1c1e" : "#063761");
      metaThemeColor = document.querySelector(
        "meta[name=apple-mobile-web-app-status-bar-style]"
      );
      metaThemeColor.setAttribute(
        "content",
        darkMode ? "black-translucent" : "default"
      );
      document.body.style.backgroundColor = darkMode ? "#1c1c1e" : "#FFFFFF";
    },
    calcClick: function(foo, disabled) {
      if (disabled) {
        this.snackBarSoon = true;
        return;
      }
      if (this.$route.params.calc !== "") {
        this.$router.push("/" + this.$route.params.plane + "/" + foo);
        return;
      }
    },
    planeClick: function() {
      let foo = this.$store.get("lastPlane");
      if (foo) this.$router.push("/" + foo);
    },
    onload() {
      if (
        (this.selectedPlane[1] === undefined ||
          this.selectedPlane[1] !== this.$route.params.plane) &&
        this.$route.params.plane !== undefined
      ) {
        this.selectedPlane[0] = this.$route.params.plane;
        let manuArray = Object.keys(this.json);
        for (let i = 0; i < manuArray.length; i++) {
          if (
            Object.keys(this.json[manuArray[i]]).includes(this.selectedPlane[0])
          ) {
            this.selectedPlane[1] = manuArray[i];
          }
        }
        if (this.selectedPlane[1] === undefined) {
          this.$router.push("/404");
        }
      }
      if (!this.middleValue) {
        this.middleValue = this.$route.params.plane;
      }
    },
    isIos() {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    },
    isInStandaloneMode() {
      return "standalone" in window.navigator && window.navigator.standalone;
    }
  },
  computed: {
    tabModel: {
      get() {
        switch (this.$route.name) {
          case "W&B":
            return 1;
          case "Take-off":
            return 2;
          case "Cruise":
            return 3;
          case "Landing":
            return 4;
          default:
            return 0;
        }
      },
      set(foo) {}
    },
    tabShow() {
      if (this.$route.params.plane !== undefined) {
        return true;
      }
      return false;
    },
    planeShow() {
      if (
        this.$route.params.plane != null ||
        this.$store.get("lastPlane") != null
      ) {
        return true;
      }
      return false;
    },
    hangarModel: sync("hangarPanel"),
    bottomNavDisabled: sync("bottomNavDisabled"),
    topNavModel: sync("topNav"),
    selectedPlane: sync("selectedPlane"),
    middleValue: sync("lastPlane")
  }
};
</script>

<style>
.unselectable {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

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

#whitesmoke.v-btn--active {
  background-color: rgb(185, 185, 185) !important;
}

.v-tabs-slider-wrapper {
  height: 3px !important;
}

.tabCustom {
  min-width: 60px !important;
}
.invisibleTab {
  width: 0px;
  min-width: 0px !important;
  padding: 0px !important;
  margin-left: auto !important;
}
.tabDiv {
  -webkit-box-shadow: 0 3px 14px 2px rgba(0, 0, 0, 0.12);
  box-shadow: 0 3px 14px 2px rgba(0, 0, 0, 0.12);
  position: fixed;
  bottom: 0px;
  right: 0px;
  left: 0px;
}
.v-tab--disabled {
  pointer-events: all;
  opacity: 0.5;
}

.noopacity .v-btn__content {
  opacity: 1 !important;
}

.absoluteInfo {
  position: absolute;
  bottom: 0px !important;
}

.fixedInfo {
  position: fixed;
}

.cancelFab {
  transform: rotate(45deg);
}

.fabSize {
  height: 40px !important;
  width: 40px !important;
}

.theme--dark.v-application {
  background: #010101 !important;
}

.theme--dark.v-bottom-navigation {
  background-color: #1c1c1e !important;
}

.theme--dark.v-tabs > .v-tabs-bar {
  background-color: #1c1c1e !important;
}

.theme--dark.v-card {
  background-color: #1c1c1e !important;
}

.theme--dark.v-sheet {
  background-color: #1c1c1e !important;
}

.theme--dark.v-expansion-panels .v-expansion-panel {
  background-color: #1c1c1e !important;
}
</style>
