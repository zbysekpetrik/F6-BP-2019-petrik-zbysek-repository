export const rwyConditions = {
  mixins: [calculations, vuex],
  data: function() {
    return {
      selectMenu: false,
      slopeExpand: false
    };
  },
  methods: {
    updateSlope: function() {
      this.slope =
        Math.round(
          this.RWY_SLOPE(this.DER_ELEV, this.THR_ELEV, this.TORA) * 100
        ) / 100;
    }
  },
  computed: {
    selectedRWY: {
      get: function() {
        return this.getter.rwyConditions.RWY;
      },
      set: function(foo) {
        this.$store.commit(this.mutationPath + "/rwyConditions", { RWY: foo });
        if (isNaN(foo)) {
          if (this.RWY[foo] !== undefined) {
            this.RWYdirection = this.RWY[foo].direction;
            this.TORA = this.RWY[foo].TORA;
            this.TODA = this.RWY[foo].TODA;
            this.THR_ELEV = this.RWY[foo]["THR ELEV"];
            this.DER_ELEV = this.RWY[foo]["DER ELEV"];
            this.AD_ELEV = this.RWY[foo]["AD ELEV"];
            this.surface = this.RWY[foo]["SURFACE"];
            this.updateSlope();
          }
        } else {
          this.RWYdirection = +foo * 10;
        }
      }
    },
    RWYdirection: {
      get: function() {
        return this.getter.rwyConditions.RWYdirection;
      },
      set: function(foo) {
        this.$store.commit(this.mutationPath + "/rwyConditions", {
          RWYdirection: +foo
        });
      }
    },
    TORA: {
      get: function() {
        return this.getter.rwyConditions.TORA;
      },
      set: function(foo) {
        this.$store.commit(this.mutationPath + "/rwyConditions", {
          TORA: +foo
        });
        this.updateSlope();
      }
    },
    TODA: {
      get: function() {
        return this.getter.rwyConditions.TODA;
      },
      set: function(foo) {
        this.$store.commit(this.mutationPath + "/rwyConditions", {
          TODA: +foo
        });
      }
    },
    slope: {
      get: function() {
        return this.getter.rwyConditions.RWY_Slope;
      },
      set: function(foo) {
        this.$store.commit(this.mutationPath + "/rwyConditions", {
          RWY_Slope: +foo
        });
      }
    },
    THR_ELEV: {
      get: function() {
        return this.getter.rwyConditions.THR_ELEV;
      },
      set: function(foo) {
        this.$store.commit(this.mutationPath + "/rwyConditions", {
          THR_ELEV: +foo
        });
        this.updateSlope();
      }
    },
    DER_ELEV: {
      get: function() {
        return this.getter.rwyConditions.DER_ELEV;
      },
      set: function(foo) {
        this.$store.commit(this.mutationPath + "/rwyConditions", {
          DER_ELEV: +foo
        });
        this.updateSlope();
      }
    },
    AD_ELEV: {
      get: function() {
        return this.getter.rwyConditions.AD_ELEV;
      },
      set: function(foo) {
        this.$store.commit(this.mutationPath + "/rwyConditions", {
          AD_ELEV: +foo
        });
      }
    },
    surface: {
      get: function() {
        return this.getter.rwyConditions.surface;
      },
      set: function(foo) {
        this.$store.commit(this.mutationPath + "/rwyConditions", {
          surface: foo
        });
      }
    },
    contamination: {
      get: function() {
        return this.getter.rwyConditions.contamination;
      },
      set: function(foo) {
        this.$store.commit(this.mutationPath + "/rwyConditions", {
          contamination: foo
        });
      }
    }
  }
};
