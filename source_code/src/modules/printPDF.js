import template from "./templatePDF.js"
import FlyCalc from "./calculate.js";
import jsPDF from "jspdf";

export const exportRWY = function (doc, y, rwyData, mode) {
    doc.setFontType("bold");
    doc.text("Runway", 20, y);
    doc.setFontType("normal");
    y += 8;
    doc.text(`RWY: ${rwyData.selectedRWY}`, 25, y);
    y += 8;
    if (rwyData.selectedRWY === "Custom") {
        doc.text(`${!rwyData.customRWYmagXdes ? 'RWY designator': 'RWY heading'}: ${rwyData.customRWY}${!rwyData.customRWYmagXdes ? '': '°'}`, 25, y);
        y += 8;
    }
    if (mode === "TO") {
        doc.text(`TORA: ${rwyData.TORA} m`, 25, y);
        y += 8;
        doc.text(`TODA: ${rwyData.TODA} m`, 25, y);
        y += 8;
    }
    else if (mode === "LD") {
        doc.text(`LDA: ${rwyData.LDA} m`, 25, y);
        y += 8;
    }
    doc.text(
        `RWY Slope: ${rwyData.slope} %`,
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
    if (meteoData.HW >= 0) {
        doc.text(`HW: ${Math.abs(meteoData.HW)} kt`, 25, y);
    } else {
        doc.text(`TW: ${Math.abs(meteoData.HW)} kt`, 25, y);
    }
    y += 8;
    if (meteoData.XW >= 0) {
        doc.text(`RXW: ${Math.abs(meteoData.XW)} kt`, 25, y);
    } else {
        doc.text(`LXW: ${Math.abs(meteoData.XW)} KT`, 25, y);
    }
    y += 8;
    doc.text(`OAT: ${meteoData.OAT} °C`, 25, y);
    y += 8;
    doc.text(`QNH: ${meteoData.QNH} hPa`, 25, y);
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