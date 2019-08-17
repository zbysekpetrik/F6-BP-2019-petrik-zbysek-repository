import FlyCalc from "@/modules/calculate.js"
import { GT, hoffmann } from "@/assets/P2008JC_PERF_table.js"
import nestedObjectAssign from "nested-object-assign";
import jsPDF from "jspdf";

let GTconfig = {
    WaB: {
        components: [
            { name: "Pilot and passenger", arm: 1.8, unit: "kg", toKg: 1, rule: [v => !!v || "Required!", v => v >= 0 || "Value below zero not allowed!"] },
            { name: "Fuel", arm: 2.209, unit: "L", toKg: 0.72, rule: [v => !!v || "Required!", v => v >= 0 || "Value below zero not allowed!", v => v <= 120 || `Maximum volume: 120 L`] },
            { name: "Baggage", arm: 2.417, unit: "kg", toKg: 1, rule: [v => (v >= 0 || v === undefined) || "Value below zero not allowed!", v => (v <= 20 || v === undefined) || `Maximum weight: 20 kg`] }],
        envelope: [
            {
                x: 1.841,
                y: "BEW"
            },
            {
                x: 1.841,
                y: "MTOW"
            },
            {
                x: 1.978,
                y: "MTOW"
            },
            {
                x: 1.978,
                y: "BEW"
            },
            {
                x: 1.841,
                y: "BEW"
            }
        ],
        summary: ['BEW', 'TOW', 'CG', '%MAC'],
        armToMAC(arm) {
            return (arm - 1.566) / 1.373
        }
    },
    TO: {
        conditions: [
            { name: "Flaps", value: "T/O" },
            { name: "Speed at lift-off", value: "48 kt" },
            { name: "Speed over 50ft", value: "60 kt" }
        ],
        TOR(totalWeight, AD_ELEV, OAT, QNH, surface, contamination) {
            let TOR =
                (1.79452160004034e-6 * Math.pow(OAT, 3) +
                    0.00465856512000457 * Math.pow(OAT, 2) +
                    1.87288543599989 * OAT +
                    212.88274460003) *
                Math.exp(
                    0.0000898337078742956 * FlyCalc.pressureAltitude(AD_ELEV, QNH)
                ) *
                (1.71976883337926e-7 * Math.pow(totalWeight, 2.40469087630086));
            let rwyConditions = 1
            if (surface === "Paved") {
                rwyConditions += -0.05
            }
            switch (contamination) {
                case 'Dry':
                    rwyConditions += 0
                    break
                case 'Slippery / Wet':
                    rwyConditions += 0.20
                    break
                case 'Mud':
                    rwyConditions += 0.30
                    break
                case 'Snow ( up to 5 cm )':
                    rwyConditions += 0.25
                    break
                case 'Slush':
                    rwyConditions += 0.30
                    break
            }
            TOR *= rwyConditions
            return TOR;
        },
        TOD(totalWeight, AD_ELEV, OAT, QNH) {
            let TOD =
                ((0.00000002 * Math.pow(totalWeight, 2) +
                    2.40120654758095e-6 * totalWeight -
                    0.00249970122117848) *
                    Math.pow(OAT, 2) +
                    (0.0000100968437230389 * Math.pow(totalWeight, 2) -
                        0.00248999242912373 * totalWeight +
                        0.363751594986628) *
                    OAT +
                    (0.00118032251123796 * Math.pow(totalWeight, 2) -
                        0.282043752578887 * totalWeight +
                        38.2487838554114)) *
                Math.exp(
                    0.0000872379651458918 * FlyCalc.pressureAltitude(AD_ELEV, QNH)
                );
            return TOD;
        },
        TORWindCorrected(totalWeight, AD_ELEV, OAT, QNH, headWind, surface, contamination) {
            let corrected = this.TOR(totalWeight, AD_ELEV, OAT, QNH, surface, contamination);
            if (headWind > 0) {
                corrected -= 5 * headWind;
            } else {
                corrected += -15 * headWind;
            }
            return corrected;
        },
        TORcorrected(
            totalWeight,
            AD_ELEV,
            slope,
            OAT,
            QNH,
            headWind,
            surface,
            contamination
        ) {
            if (!FlyCalc.checkIfAllHasValue([totalWeight,
                AD_ELEV,
                slope,
                OAT,
                QNH,
                headWind,
                surface,
                contamination]))
                return NaN
            let corrected = this.TORWindCorrected(
                totalWeight,
                AD_ELEV,
                OAT,
                QNH,
                headWind,
                surface, contamination
            );
            if (this.slope > 0) {
                corrected *= 1 + 0.07 * slope;
            }
            return corrected;
        },
        TODcorrected(
            totalWeight,
            AD_ELEV,
            slope,
            OAT,
            QNH,
            headWind,
            surface,
            contamination
        ) {
            if (!FlyCalc.checkIfAllHasValue([totalWeight,
                AD_ELEV,
                slope,
                OAT,
                QNH,
                headWind,
                surface,
                contamination]))
                return NaN
            let corrected = this.TOD(totalWeight, AD_ELEV, OAT, QNH);
            if (headWind > 0) {
                corrected -= 5 * headWind;
            } else {
                corrected += -15 * headWind;
            }
            corrected -= this.TORWindCorrected(
                totalWeight,
                AD_ELEV,
                OAT,
                QNH,
                headWind,
                null, null
            );
            corrected += this.TORcorrected(
                totalWeight,
                AD_ELEV,
                slope,
                OAT,
                QNH,
                headWind,
                surface, contamination
            );
            return corrected;
        },
        climb(totalWeight, AD_ELEV, OAT, QNH) {
            if (!FlyCalc.checkIfAllHasValue([totalWeight, AD_ELEV, OAT, QNH]))
                return NaN
            let climb = 0;
            climb +=
                0.00000006103 * Math.pow(FlyCalc.pressureAltitude(AD_ELEV, QNH), 2);
            climb +=
                (-0.0000001671 * Math.pow(totalWeight, 2) +
                    0.0002790554 * totalWeight -
                    0.1767089766) *
                FlyCalc.pressureAltitude(AD_ELEV, QNH);
            climb +=
                0.0030126631 * Math.pow(totalWeight, 2) -
                5.8061618005 * totalWeight +
                3168.0875635955;
            let tempKoef = 0;
            tempKoef +=
                (0.0000000038 * FlyCalc.pressureAltitude(AD_ELEV, QNH) -
                    0.0000746667) *
                Math.pow(OAT, 3);
            tempKoef +=
                (-0.0000000714 * FlyCalc.pressureAltitude(AD_ELEV, QNH) + 0.015) *
                Math.pow(OAT, 2);
            tempKoef +=
                (-0.00000000000019149832 *
                    Math.pow(FlyCalc.pressureAltitude(AD_ELEV, QNH), 3) +
                    0.00000000480519480421 *
                    Math.pow(FlyCalc.pressureAltitude(AD_ELEV, QNH), 2) +
                    0.0000221296296278178 * FlyCalc.pressureAltitude(AD_ELEV, QNH) -
                    6.74363636362104) *
                OAT;
            tempKoef +=
                -0.0013690476 * FlyCalc.pressureAltitude(AD_ELEV, QNH) +
                161.3333333333;
            tempKoef *=
                0.0000025518 * Math.pow(totalWeight, 2) -
                0.0042338958 * totalWeight +
                2.672666424;
            climb += tempKoef;
            return climb;
        },
        Vy(totalWeight, AD_ELEV, QNH) {
            if (!FlyCalc.checkIfAllHasValue([totalWeight, AD_ELEV, QNH]))
                return NaN
            let Vy =
                -0.0002916667 * FlyCalc.pressureAltitude(AD_ELEV, QNH) + 66.9166666667;
            Vy *= 0.0001243781 * totalWeight + 0.9191542289;
            return Vy;
        }
    },
    cruise: {
        ROC: {
            conditions: [
                { name: "Flaps", value: "UP" },
                { name: "Throttle levers", value: "Full forward" }
            ],
            ROC(totalWeight, pressureAltitude, OAT) {
                if (!FlyCalc.checkIfAllHasValue([totalWeight, pressureAltitude, OAT]))
                    return NaN
                let rateOfClimb = 0;
                rateOfClimb += 0.0000000521 * Math.pow(pressureAltitude, 2);
                rateOfClimb +=
                    (-0.00000000093112285715 * Math.pow(totalWeight, 3) +
                        0.00000152312997143135 * Math.pow(totalWeight, 2) -
                        0.000756093534286577 * totalWeight +
                        0.0495081180000077) *
                    pressureAltitude;
                rateOfClimb +=
                    0.0030584495 * Math.pow(totalWeight, 2) -
                    5.9082846715 * totalWeight +
                    3267.2127571326;
                let tempKoef = 0;
                tempKoef +=
                    (0.0000000000125 * Math.pow(pressureAltitude, 2) -
                        0.00000028166666666666 * pressureAltitude +
                        0.0117133333333333) *
                    Math.pow(OAT, 2);
                tempKoef +=
                    (-0.00000000002083333333 * Math.pow(pressureAltitude, 2) +
                        0.0000466916666666661 * pressureAltitude -
                        5.60849999999999) *
                    OAT;
                tempKoef +=
                    -0.00000002447916666667 * Math.pow(pressureAltitude, 2) -
                    0.000745625000000028 * pressureAltitude +
                    132.379166666666;
                tempKoef *=
                    0.0000025518 * Math.pow(totalWeight, 2) -
                    0.0042338958 * totalWeight +
                    2.672666424;
                rateOfClimb += tempKoef;
                return rateOfClimb;
            },
            Vy(totalWeight, pressureAltitude) {
                if (!FlyCalc.checkIfAllHasValue([totalWeight, pressureAltitude]))
                    return NaN
                let Vy = -0.0007083333 * pressureAltitude + 71.0833333333;
                Vy *= 0.000136612 * totalWeight + 0.9112021858;
                return Vy;
            },
        },
        PERF: {
            PERF_table: GT,
            KTAS: function (totalWeight, RPM, pressureAltitude, OAT) {
                if (!FlyCalc.checkIfAllHasValue([totalWeight, RPM, pressureAltitude, OAT]))
                    return NaN
                let KTAS = this.PERF_table[pressureAltitude][RPM].KTAS;
                let correction = 1 + ((630 - totalWeight) * 3.3) / 10000;
                let ISA = FlyCalc.ISA(pressureAltitude);
                if (OAT > ISA) {
                    correction *= 1 - ((OAT - ISA) * 2) / 15 / 100;
                } else {
                    correction *= 1 - ((OAT - ISA) * 1) / 15 / 100;
                }
                KTAS *= correction;
                return KTAS;
            },
            fuelConsumption: function (totalWeight, RPM, pressureAltitude, OAT) {
                if (!FlyCalc.checkIfAllHasValue([RPM, pressureAltitude, OAT]))
                    return NaN
                let fuelConsumption =
                    this.PERF_table[pressureAltitude][RPM].fuelConsumption;
                let correction;
                let ISA = FlyCalc.ISA(pressureAltitude);
                if (OAT > ISA) {
                    correction = 1 - ((OAT - ISA) * 2.5) / 15 / 100;
                } else {
                    correction = 1 - ((OAT - ISA) * 3) / 15 / 100;
                }
                fuelConsumption *= correction;
                return fuelConsumption;
            },
            endurance: function (totalWeight, RPM, pressureAltitude, OAT) {
                if (!FlyCalc.checkIfAllHasValue([RPM, pressureAltitude, OAT]))
                    return NaN
                let endurance = FlyCalc.stringToSecond(
                    this.PERF_table[pressureAltitude][RPM].endurance
                );
                let correction;
                let ISA = FlyCalc.ISA(pressureAltitude);
                if (OAT > ISA) {
                    correction = 1 + ((OAT - ISA) * 2) / 15 / 100;
                } else {
                    correction = 1 + ((OAT - ISA) * 4) / 15 / 100;
                }
                endurance *= correction;
                endurance = Math.round(endurance);
                endurance = FlyCalc.secondsToString(endurance);
                return endurance;
            },
            range: function (totalWeight, RPM, pressureAltitude, OAT) {
                if (!FlyCalc.checkIfAllHasValue([totalWeight, RPM, pressureAltitude, OAT]))
                    return NaN
                let range = this.PERF_table[pressureAltitude][RPM].range;
                let correction = 1 + ((630 - totalWeight) * 3) / 10000;
                let ISA = FlyCalc.ISA(pressureAltitude);
                if (OAT > ISA) {
                    correction *= 1 + ((OAT - ISA) * 1) / 15 / 100;
                } else {
                    correction *= 1 + ((OAT - ISA) * 2) / 15 / 100;
                }
                range *= correction;
                return range;
            },
            specificRange: function (totalWeight, RPM, pressureAltitude, OAT) {
                if (!FlyCalc.checkIfAllHasValue([totalWeight, RPM, pressureAltitude, OAT]))
                    return NaN
                let specificRange =
                    this.PERF_table[pressureAltitude][RPM].specificRange;
                let correction = 1 + ((630 - totalWeight) * 4) / 10000;
                let ISA = FlyCalc.ISA(pressureAltitude);
                if (OAT > ISA) {
                    correction *= 1 + ((OAT - ISA) * 1) / 15 / 100;
                } else {
                    correction *= 1 + ((OAT - ISA) * 1) / 15 / 100;
                }
                specificRange *= correction;
                return specificRange;
            }
        }
    },
    LD: {
        conditions: [
            { name: "LW", value: "650 kg" },
            { name: "Flaps", value: "Landing" },
            { name: "Short final approach speed", value: "54 kt" }
        ],
        LR(AD_ELEV, OAT, QNH, surface, contamination) {
            let LR = (0.0000236965801730635 * Math.pow(OAT, 2) + 0.600216197193662 * OAT + 163.563319309058) * Math.exp(0.000037438845651908 * FlyCalc.pressureAltitude(AD_ELEV, QNH))
            let rwyConditions = 1
            if (surface === "Paved") {
                rwyConditions += -0.05
            }
            switch (contamination) {
                case 'Dry':
                    rwyConditions += 0
                    break
                case 'Slippery / Wet':
                    rwyConditions += 0.20
                    break
                case 'Mud':
                    rwyConditions += 0.30
                    break
                case 'Snow ( up to 5 cm )':
                    rwyConditions += 0.25
                    break
                case 'Slush':
                    rwyConditions += 0.30
                    break
            }
            LR *= rwyConditions
            return LR;
        },
        LD(AD_ELEV, OAT, QNH) {
            let LD = (0 * Math.pow(OAT, 2) + 0.663354361401726 * OAT + 370.574305816547) * Math.exp(0.0000186980581225743 * FlyCalc.pressureAltitude(AD_ELEV, QNH))
            return LD;
        },
        LRWindCorrected(AD_ELEV, OAT, QNH, headWind, surface, contamination) {
            let corrected = this.LR(AD_ELEV, OAT, QNH, surface, contamination);
            if (headWind > 0) {
                corrected -= 4 * headWind;
            } else {
                corrected += -13 * headWind;
            }
            return corrected;
        },
        LRcorrected(AD_ELEV, slope, OAT, QNH, headWind, surface, contamination) {
            if (!FlyCalc.checkIfAllHasValue([
                AD_ELEV,
                slope,
                OAT,
                QNH,
                headWind,
                surface,
                contamination]))
                return NaN
            let corrected = this.LRWindCorrected(AD_ELEV, OAT, QNH, headWind, surface, contamination);
            if (slope > 0) {
                corrected *= 1 + 0.05 * slope;
            }
            return corrected;
        },
        LDcorrected(AD_ELEV, slope, OAT, QNH, headWind, surface, contamination) {
            if (!FlyCalc.checkIfAllHasValue([
                AD_ELEV,
                slope,
                OAT,
                QNH,
                headWind,
                surface,
                contamination]))
                return NaN
            let corrected = this.LD(AD_ELEV, OAT, QNH);
            if (headWind > 0) {
                corrected -= 4 * headWind;
            } else {
                corrected += -13 * headWind;
            }
            corrected -= this.LRWindCorrected(AD_ELEV, OAT, QNH, headWind, null, null);
            corrected += this.LRcorrected(AD_ELEV, slope, OAT, QNH, headWind, surface, contamination);
            return corrected;
        }
    }
}

let hoffmannConfig = nestedObjectAssign({}, GTconfig)
hoffmannConfig.cruise.PERF.PERF_table = hoffmann
hoffmannConfig.TO.TOR = function (totalWeight, AD_ELEV, OAT, QNH, surface, contamination) {
    let TOR = ((1.92746867040436E-08 * Math.pow(totalWeight, 2) + -9.32450991894753E-06 * totalWeight - -0.00202387698794093) * Math.pow(OAT, 2) + (5.67190241688398E-06 * Math.pow(totalWeight, 2) - 0.0015706724081547 * totalWeight + 0.213024462172446) * OAT + (0.000677773945666141 * Math.pow(totalWeight, 2) - 0.216826205434136 * totalWeight + 34.9780691684333)) * Math.exp(0.0000902786216973305 * FlyCalc.pressureAltitude(AD_ELEV, QNH))
    let rwyConditions = 1
    if (surface === "Paved") {
        rwyConditions += -0.05
    }
    switch (contamination) {
        case 'Dry':
            rwyConditions += 0
            break
        case 'Slippery / Wet':
            rwyConditions += 0.20
            break
        case 'Mud':
            rwyConditions += 0.30
            break
        case 'Snow ( up to 5 cm )':
            rwyConditions += 0.25
            break
        case 'Slush':
            rwyConditions += 0.30
            break
    }
    TOR *= rwyConditions
    return TOR;
}
hoffmannConfig.TO.TOD = function (totalWeight, AD_ELEV, OAT, QNH) {
    let TOD = ((2.92965580990723E-08 * Math.pow(totalWeight, 2) + -0.0000103820582444141 * totalWeight - -0.00199725637541149) * Math.pow(OAT, 2) + (0.0000105588277819935 * Math.pow(totalWeight, 2) - 0.00258854784247653 * totalWeight + 0.386833998337983) * OAT + (0.00125614991837811 * Math.pow(totalWeight, 2) - 0.309636247292158 * totalWeight + 46.4552360611659)) * Math.exp(0.0000864591237314215 * FlyCalc.pressureAltitude(AD_ELEV, QNH))
    return TOD;
}

import { exportRWY, exportMeteo, renderTemplate } from "@/modules/printPDF.js"

let printPDF = (data, plane, BEW) => {
    console.log(plane)
    let newPage = false;
    let doc = new jsPDF();
    let d = new Date();
    doc.setDocumentProperties({
        title: plane + "-" + FlyCalc.dateToString(d)
    });
    doc = renderTemplate(doc, d, plane, newPage);
    let y = 45;
    if (true) {
        if (newPage) {
            doc = renderTemplate(doc, d, plane, true);
        } else {
            newPage = true;
        }
        doc.setTextColor("#000000");
        doc.setFontSize(16);
        doc.setFontType("bold");
        doc.text("Weight and balance", 15, y);
        doc.setFontSize(11);
        y += 8;
        doc.setFontType("bold");
        doc.text("Weight", 20, y);
        doc.setFontType("normal");
        y += 8;
        doc.text(
            `Pilot and passenger: ${data.WaB.componentsArray[0]} kg`,
            25,
            y
        );
        y += 8;
        doc.text(`Fuel: ${data.WaB.componentsArray[1] * 0.72} L`, 25, y);
        y += 8;
        doc.text(`Baggage: ${data.WaB.componentsArray[2]} kg`, 25, y);
        y += 8;
        y += 2;
        doc.setFontType("bold");
        doc.text("Summary", 20, y);
        doc.setFontType("normal");
        y += 8;
        doc.text(
            `BEW: ${BEW} kg`,
            25,
            y
        );
        y += 8;
        doc.text(`TOW: ${data.WaB.results.TOW} kg`, 25, y);
        y += 8;
        doc.text(`%MAC: ${data.WaB.results.MAC} %`, 25, y);
        y += 8;
        doc.text(`CG: ${data.WaB.results.CG} m`, 25, y);
        y += 16;
        if(data.WaB.chart)
        doc.addImage(data.WaB.chart, "PNG", 40, y, 130, 65);
        y = 45;
    }
    doc.save(plane + "-" + FlyCalc.dateToString(d) + ".pdf");
}

export default {
    GT: GTconfig,
    hoffmann: hoffmannConfig,
    printPDF: printPDF
}