export default {
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
    isNumber(foo) {
        if (+foo) return +foo
        return 0
    },
    reformatData(foo) {
        if (isNaN(foo) || typeof foo === "string") {
            if (typeof foo === "string") {
                if (foo === "") {
                    foo = null
                }
                else if (+foo || foo === "0") {
                    foo = +foo
                }
            }
            else {
                foo = null
            }
        }
        return foo
    },
    emptyToZero(foo) {
        let doNotModify = ["wind", 'customRWY']
        let keys = Object.keys(foo)
        for (let i = 0; i < keys.length; i++) {
            if (!doNotModify.includes(keys[i])) {
                foo[keys[i]] = this.reformatData(foo[keys[i]])
            }
        }
        return foo
    },
    checkIfAllHasValue(foo) {
        for (let i = 0; i < foo.length; i++) {
            if (foo[i] === null || foo[i] === undefined || foo[i] === NaN)
                return false
        }
        return true
    }
}