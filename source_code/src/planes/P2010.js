export default {
    WaB: {
        components: [
            { name: "Pilot and passenger", arm: 0.133, unit: "kg", toKg: 1, rule: [v => !!v || "Required!", v => v >= 0 || "Value below zero not allowed!"] },
            { name: "Rear seats", arm: 1.057, unit: "kg", toKg: 1, rule: [v => (v >= 0 || v === undefined) || "Value below zero not allowed!"] },
            { name: "Fuel", arm: 0.612, unit: "L", toKg: 0.72, rule: [v => !!v || "Required!", v => v >= 0 || "Value below zero not allowed!", v => v <= 230 || `Maximum volume: 230 L`] },
            { name: "Baggage", arm: 1.599, unit: "kg", toKg: 1, rule: [v => (v >= 0 || v === undefined) || "Value below zero not allowed!", v => (v <= 40 || v === undefined) || `Maximum weight: 40 kg`] }],
        envelope: [
            {
                x: 0.262,
                y: "BEW"
            },
            {
                x: 0.262,
                y: "MTOW"
            },
            {
                x: 0.44,
                y: "MTOW"
            },
            {
                x: 0.44,
                y: "BEW"
            },
            {
                x: 0.262,
                y: "BEW"
            }
        ],
        summary: ['BEW', 'TOW', 'CG', '%MAC'],
        armToMAC(arm) {
            return arm/1.378
        }
    }
}