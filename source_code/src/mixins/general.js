export const calculations = {
  methods: {
    pressureAltitude(ELEV, QNH) {
      return +ELEV + 27 * (1013 - +QNH);
    },
    ISA(pressureAltutide) {
      return 15 - (+pressureAltutide / 1000) * 2;
    },
    RWY_SLOPE(DER_ELEV, THR_ELEV, TORA) {
      let slope = +DER_ELEV - +THR_ELEV;
      slope /= TORA / 0.305;
      slope *= 100;
      return slope;
    },
    stringToSecond: function (string) {
      let splitArray = string.split(":");
      let seconds = +splitArray[0] * 3600;
      seconds += +splitArray[1] * 60;
      return +seconds;
    },
    secondsToString: function (seconds) {
      let string = "";
      string += Math.floor(seconds / 3600);
      seconds -= Math.floor(seconds / 3600) * 3600;
      string += ":";
      let num = Math.round(+seconds / 60); // any number between 0 & 99
      let result = ("0" + num).substr(-2);
      string += result;
      return string;
    },
    dateToString(date) {
      let months = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC"
      ];
      let output = ("0" + date.getUTCDate()).substr(-2);
      output += " ";
      output += months[date.getUTCMonth()];
      output += " ";
      output += date.getUTCFullYear();
      output += " ";
      output += ("0" + date.getUTCHours()).substr(-2);
      output += ":";
      output += ("0" + date.getUTCMinutes()).substr(-2);
      output += " UTC";
      return output;
    },
    isString(string) {
      return Object.prototype.toString.call(string) === "[object String]";
    },
    checkIfAnyTrue(obj) {
      let output = false;
      Object.keys(obj).forEach(key => {
        if (obj[key]) {
          output = true;
        }
      });
      return output;
    },
  }
};

export const vuex = {
  data() {
    return {
      mutationPath: this.$route.params.plane + "/" + this.$route.params.calc
    };
  },
  computed: {
    getter: {
      get: function () {
        return this.$store.getters[
          this.$route.params.plane + "/" + this.$route.params.calc
        ];
      }
    }
  }
};

export const templatePDF =
  "data:image/png;base64,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";