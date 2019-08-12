export default {
    WaB: {
        components: [
            { name: "Pilot and passenger", arm: -0.86, unit: "kg", toKg: 1, rule: [v => !!v || "Required!", v => v >= 0 || "Value below zero not allowed!"] },
            { name: "Rear seats", arm: 0.13, unit: "kg", toKg: 1, rule: [v => !!v || "Required!", v => v >= 0 || "Value below zero not allowed!"] },
            { name: "Baggage", arm: 1.17, unit: "kg", toKg: 1, rule: [v => (v >= 0 || v === undefined) || "Value below zero not allowed!", v => (v <= 80 || v === undefined) || `Maximum weight: 80 kg`] },
            { name: "Fuel", arm: 0.79, unit: "L", toKg: 0.72, rule: [v => !!v || "Required!", v => v >= 0 || "Value below zero not allowed!", v => v <= 194.4 || `Maximum volume: 194.4 L`] }],
        envelope: [
            {
                x: 0.220935,
                y: "BEW"
            },
            {
                x: 0.220935,
                y: "MTOW"
            },
            {
                x: 0.41509,
                y: "MTOW"
            },
            {
                x: 0.41509,
                y: "BEW"
            },
            {
                x: 0.220935,
                y: "BEW"
            }
        ],
        minFLTW: [
            {
                x: 0.220935,
                y: 856
            },
            {
                x: 0.41509,
                y: 856
            },
        ],
        summary: ['BEW', 'TOW', 'CG', '%MAC'],
        armToMAC(arm) {
            return arm/1.339
        }
    }
}