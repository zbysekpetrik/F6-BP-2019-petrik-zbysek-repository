import template from "./templatePDF.js"
import FlyCalc from "./calculate.js";
import jsPDF from "jspdf";

export const exportRWY = function (doc, y, rwyData, mode) {
    doc.setFontType("bold");
    doc.text("Runway", 20, y);
    doc.setFontType("normal");
    y += 8;
    doc.text(`RWY: ${rwyData.RWY}`, 25, y);
    y += 8;
    if (mode === "TO") {
        doc.text(`TORA: ${rwyData.TORA} m`, 25, y);
        y += 8;
        doc.text(`TODA: ${rwyData.TODA} m`, 25, y);
        y += 8;
    }
    else if (mode === "LD") {
        doc.text(`TORA: ${rwyData.TORA} m`, 25, y);
        y += 8;
    }
    doc.text(
        `RWY Slope: ${rwyData.RWY_Slope} %`,
        25,
        y
    );
    y += 8;
    doc.text(
        `THR ELEV: ${rwyData.THR_ELEV} ft`,
        25,
        y
    );
    y += 8;
    doc.text(
        `DER ELEV: ${rwyData.DER_ELEV} ft`,
        25,
        y
    );
    y += 8;
    doc.text(`AD ELEV: ${rwyData.AD_ELEV} ft`, 25, y);
    y += 8;
    doc.text(`Surface: ${rwyData.surface}`, 25, y);
    y += 8;
    doc.text(
        `RWY Condition: ${rwyData.contamination}`,
        25,
        y
    );
    y += 8;
    y += 2;
    return [doc, y]
}

export const exportMeteo = function (doc, y, meteoData) {
    doc.setFontType("bold");
    doc.text("Meteo", 20, y);
    doc.setFontType("normal");
    y += 8;
    doc.text(
        `Wind: ${meteoData.wind} ° / kt`,
        25,
        y
    );
    y += 8;
    if (getter.landing.meteo.HW >= 0) {
        doc.text(`HW: ${Math.abs(getter.landing.meteo.HW)} kt`, 25, y);
    } else {
        doc.text(`TW: ${Math.abs(getter.landing.meteo.HW)} kt`, 25, y);
    }
    y += 8;
    if (getter.landing.meteo.XW >= 0) {
        doc.text(`RXW: ${Math.abs(getter.landing.meteo.XW)} kt`, 25, y);
    } else {
        doc.text(`LXW: ${Math.abs(getter.landing.meteo.XW)} KT`, 25, y);
    }
    y += 8;
    doc.text(`OAT: ${getter.landing.meteo.OAT} °C`, 25, y);
    y += 8;
    doc.text(`QNH: ${getter.landing.meteo.QNH} hPa`, 25, y);
    y += 8;
    y += 2;
    return [doc, y]
}

export const renderTemplate = function (doc, date, plane, newpage) {
    if (newpage) {
        doc.addPage();
    }
    doc.addImage(template, "PNG", 0, -1, 210, 33.67);
    doc.setFontSize(16);
    doc.setTextColor("#FFFFFF");
    doc.setFontType("bold");
    doc.text(FlyCalc.dateToString(date), 10, 12);
    doc.text(plane, 95, 12);
    return doc;
}
/*
export default {
    generatePDF(plane, data) {
        let newPage = false;
        let doc = new jsPDF();
        let d = new Date();
        doc.setDocumentProperties({
            title: plane + "-" + this.dateToString(d)
        });
        doc = this.renderTemplate(doc, d, plane, false);
        let y = 45;
        if (choose.weightbalance) {
            if (newPage) {
                doc = this.renderTemplate(doc, d, plane, true);
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
                `Pilot and passenger: ${getter.weightbalance.weight.frontseats} kg`,
                25,
                y
            );
            y += 8;
            doc.text(`Fuel: ${getter.weightbalance.weight.fuel} L`, 25, y);
            y += 8;
            doc.text(`Baggage: ${getter.weightbalance.weight.baggage} kg`, 25, y);
            y += 8;
            y += 2;
            doc.setFontType("bold");
            doc.text("Summary", 20, y);
            doc.setFontType("normal");
            y += 8;
            doc.text(
                `BEW: ${
                this.json[this.$route.params.manu][plane][
                "weight"
                ]["BEW"]
                } kg`,
                25,
                y
            );
            y += 8;
            doc.text(`TOW: ${getter.weightbalance.weight.totalWeight} kg`, 25, y);
            y += 8;
            doc.text(`%MAC: ${getter.weightbalance.results.MAC} %`, 25, y);
            y += 8;
            doc.text(`CG: ${getter.weightbalance.results.CG} m`, 25, y);
            y += 16;
            doc.addImage(getter.weightbalance.results.chart, "PNG", 40, y, 130, 65);
            y = 45;
        }
        if (choose.takeoff) {
            if (newPage) {
                doc = this.renderTemplate(doc, d, plane, true);
            } else {
                newPage = true;
            }
            doc.setTextColor("#000000");
            doc.setFontSize(16);
            doc.setFontType("bold");
            doc.text("Take-off performance", 15, y);
            doc.setFontSize(11);
            y += 8;
            doc.setFontType("bold");
            doc.text("Weight", 20, y);
            doc.setFontType("normal");
            y += 8;
            doc.text(`TOW: ${getter.takeoff.weight.totalWeight} kg`, 25, y);
            y += 8;
            y += 2;
            doc.setFontType("bold");
            doc.text("Runway", 20, y);
            doc.setFontType("normal");
            y += 8;
            doc.text(`RWY: ${getter.takeoff.rwyConditions.RWY}`, 25, y);
            y += 8;
            doc.text(`TORA: ${getter.takeoff.rwyConditions.TORA} m`, 25, y);
            y += 8;
            doc.text(`TODA: ${getter.takeoff.rwyConditions.TODA} m`, 25, y);
            y += 8;
            doc.text(
                `RWY Slope: ${getter.takeoff.rwyConditions.RWY_Slope} %`,
                25,
                y
            );
            y += 8;
            doc.text(
                `THR ELEV: ${getter.takeoff.rwyConditions.THR_ELEV} ft`,
                25,
                y
            );
            y += 8;
            doc.text(
                `DER ELEV: ${getter.takeoff.rwyConditions.DER_ELEV} ft`,
                25,
                y
            );
            y += 8;
            doc.text(`AD ELEV: ${getter.takeoff.rwyConditions.AD_ELEV} ft`, 25, y);
            y += 8;
            doc.text(`Surface: ${getter.takeoff.rwyConditions.surface}`, 25, y);
            y += 8;
            doc.text(
                `RWY Condition: ${getter.takeoff.rwyConditions.contamination}`,
                25,
                y
            );
            y += 8;
            y += 2;
            doc.setFontType("bold");
            doc.text("Meteo", 20, y);
            doc.setFontType("normal");
            y += 8;
            doc.text(
                `Wind: ${+getter.takeoff.meteo.wind.slice(0, 3) +
                " / " +
                +getter.takeoff.meteo.wind.slice(3, 5)} ° / kt`,
                25,
                y
            );
            y += 8;
            if (getter.takeoff.meteo.headWind >= 0) {
                doc.text(`HW: ${Math.abs(getter.takeoff.meteo.headWind)} kt`, 25, y);
            } else {
                doc.text(`TW: ${Math.abs(getter.takeoff.meteo.headWind)} kt`, 25, y);
            }
            y += 8;
            if (getter.takeoff.meteo.xWind >= 0) {
                doc.text(`RXW: ${Math.abs(getter.takeoff.meteo.xWind)} kt`, 25, y);
            } else {
                doc.text(`LXW: ${Math.abs(getter.takeoff.meteo.xWind)} kt`, 25, y);
            }
            y += 8;
            doc.text(`OAT: ${getter.takeoff.meteo.OAT} °C`, 25, y);
            y += 8;
            doc.text(`QNH: ${getter.takeoff.meteo.QNH} hPa`, 25, y);
            y += 8;
            y += 2;
            doc.setFontType("bold");
            doc.text("Summary", 20, y);
            doc.setFontType("normal");
            y += 8;
            doc.text(`TOR: ${getter.takeoff.results.TOR} m`, 25, y);
            y += 8;
            doc.text(`TOD: ${getter.takeoff.results.TOD} m`, 25, y);
            y += 8;
            doc.text(
                `Take-off rate of climb: ${getter.takeoff.results.climb} ft/min`,
                25,
                y
            );
            y += 8;
            doc.text(`Vy: ${getter.takeoff.results.Vy} kt`, 25, y);
            y = 45;
        }
        if (choose.cruiseClimb) {
            if (newPage) {
                doc = this.renderTemplate(doc, d, plane, true);
            } else {
                newPage = true;
            }
            doc.setTextColor("#000000");
            doc.setFontSize(16);
            doc.setFontType("bold");
            doc.text("En-route rate of climb", 15, y);
            doc.setFontSize(11);
            y += 8;
            doc.setFontType("bold");
            doc.text("Weight", 20, y);
            doc.setFontType("normal");
            y += 8;
            doc.text(`GW: ${getter.cruise.climb.weight.totalWeight} kg`, 25, y);
            y += 8;
            y += 2;
            doc.setFontType("bold");
            doc.text("Meteo", 20, y);
            doc.setFontType("normal");
            y += 8;
            doc.text(
                `Pressure altitude: ${getter.cruise.climb.meteo.pressureAltitude} ft`,
                25,
                y
            );
            y += 8;
            doc.text(`OAT: ${getter.cruise.climb.meteo.OAT} °C`, 25, y);
            y += 8;
            y += 2;
            doc.setFontType("bold");
            doc.text("Summary", 20, y);
            doc.setFontType("normal");
            y += 8;
            doc.text(
                `Rate of climb: ${getter.cruise.climb.results.climb} ft/min`,
                25,
                y
            );
            y += 8;
            doc.text(`Vy: ${getter.cruise.climb.results.Vy} kt`, 25, y);
            y += 24;
            if (!choose.cruisePerformance) {
                y = 45;
            }
            newPage = false;
        }
        if (choose.cruisePerformance) {
            if (newPage) {
                doc = this.renderTemplate(doc, d, plane, true);
            } else {
                newPage = true;
            }
            doc.setTextColor("#000000");
            doc.setFontSize(16);
            doc.setFontType("bold");
            doc.text("Cruise performance", 15, y);
            doc.setFontSize(11);
            y += 8;
            doc.setFontType("bold");
            doc.text("Weight", 20, y);
            doc.setFontType("normal");
            y += 8;
            doc.text(
                `GW: ${getter.cruise.performance.weight.totalWeight} kg`,
                25,
                y
            );
            y += 8;
            y += 2;
            doc.setFontType("bold");
            doc.text("Meteo", 20, y);
            doc.setFontType("normal");
            y += 8;
            doc.text(
                `Pressure altitude: ${
                getter.cruise.performance.meteo.pressureAltitude
                } ft`,
                25,
                y
            );
            y += 8;
            doc.text(`OAT: ${getter.cruise.performance.meteo.OAT} °C`, 25, y);
            y += 8;
            y += 2;
            doc.setFontType("bold");
            doc.text("Plane", 20, y);
            doc.setFontType("normal");
            y += 8;
            doc.text(
                `Propeller RPM: ${getter.cruise.performance.plane.RPM}`,
                25,
                y
            );
            y += 8;
            y += 2;
            doc.setFontType("bold");
            doc.text("Summary", 20, y);
            doc.setFontType("normal");
            y += 8;
            doc.text(`TAS: ${getter.cruise.performance.results.KTAS} kt`, 25, y);
            y += 8;
            doc.text(
                `Fuel consumption: ${
                getter.cruise.performance.results.fuelConsumption
                } L/h`,
                25,
                y
            );
            y += 8;
            doc.text(
                `Endurance: ${getter.cruise.performance.results.endurance}`,
                25,
                y
            );
            y += 8;
            doc.text(`Range: ${getter.cruise.performance.results.range} NM`, 25, y);
            y += 8;
            doc.text(
                `Specific range: ${
                getter.cruise.performance.results.specificRange
                } NM/L`,
                25,
                y
            );
            y = 45;
        }
        if (choose.landing) {
            if (newPage) {
                doc = this.renderTemplate(doc, d, plane, true);
            } else {
                newPage = true;
            }
            doc.setTextColor("#000000");
            doc.setFontSize(16);
            doc.setFontType("bold");
            doc.text("Landing performance", 15, y);
            doc.setFontSize(11);
            y += 8;
            doc.setFontType("bold");
            doc.text("Runway", 20, y);
            doc.setFontType("normal");
            y += 8;
            doc.text(`RWY: ${getter.landing.rwyConditions.RWY}`, 25, y);
            y += 8;
            doc.text(`LDA: ${getter.landing.rwyConditions.TODA} m`, 25, y);
            y += 8;
            doc.text(
                `RWY Slope: ${getter.landing.rwyConditions.RWY_Slope} %`,
                25,
                y
            );
            y += 8;
            doc.text(
                `THR ELEV: ${getter.landing.rwyConditions.THR_ELEV} ft`,
                25,
                y
            );
            y += 8;
            doc.text(
                `DER ELEV: ${getter.landing.rwyConditions.DER_ELEV} ft`,
                25,
                y
            );
            y += 8;
            doc.text(`AD ELEV: ${getter.landing.rwyConditions.AD_ELEV} ft`, 25, y);
            y += 8;
            doc.text(`Surface: ${getter.landing.rwyConditions.surface}`, 25, y);
            y += 8;
            doc.text(
                `RWY Condition: ${getter.landing.rwyConditions.contamination}`,
                25,
                y
            );
            y += 8;
            y += 2;
            doc.setFontType("bold");
            doc.text("Meteo", 20, y);
            doc.setFontType("normal");
            y += 8;
            doc.text(
                `Wind: ${+getter.landing.meteo.wind.slice(0, 3) +
                " / " +
                +getter.landing.meteo.wind.slice(3, 5)} ° / kt`,
                25,
                y
            );
            y += 8;
            if (getter.landing.meteo.headWind >= 0) {
                doc.text(`HW: ${Math.abs(getter.landing.meteo.headWind)} kt`, 25, y);
            } else {
                doc.text(`TW: ${Math.abs(getter.landing.meteo.headWind)} kt`, 25, y);
            }
            y += 8;
            if (getter.landing.meteo.xWind >= 0) {
                doc.text(`RXW: ${Math.abs(getter.landing.meteo.xWind)} kt`, 25, y);
            } else {
                doc.text(`LXW: ${Math.abs(getter.landing.meteo.xWind)} KT`, 25, y);
            }
            y += 8;
            doc.text(`OAT: ${getter.landing.meteo.OAT} °C`, 25, y);
            y += 8;
            doc.text(`QNH: ${getter.landing.meteo.QNH} hPa`, 25, y);
            y += 8;
            y += 2;
            doc.setFontType("bold");
            doc.text("Summary", 20, y);
            doc.setFontType("normal");
            y += 8;
            doc.text(`LD: ${getter.landing.results.LD} m`, 25, y);
            y += 8;
            doc.text(`LR: ${getter.landing.results.LR} m`, 25, y);
            y = 45;
        }

        doc.save(plane + "-" + this.dateToString(d) + ".pdf");
    }
}
*/
