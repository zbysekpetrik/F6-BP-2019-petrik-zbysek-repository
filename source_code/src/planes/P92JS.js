export default {
    WaB: {
        components: [
            { name: "Pilot and passenger", arm: 1.76, unit: "kg", toKg: 1, rule: [v => !!v || "Required!", v => v >= 0 || "Value below zero not allowed!"] },
            { name: "Fuel", arm: 1.66, unit: "L", toKg: 0.72, rule: [v => !!v || "Required!", v => v >= 0 || "Value below zero not allowed!", v => v <= 90 || `Maximum volume: 90 L`] },
            { name: "Baggage", arm: 2.21, unit: "kg", toKg: 1, rule: [v => (v >= 0 || v === undefined) || "Value below zero not allowed!", v => (v <= 20 || v === undefined) || `Maximum weight: 20 kg`] }],
        envelope: [
            {
                x: 1.727,
                y: "BEW"
            },
            {
                x: 1.727,
                y: "MTOW"
            },
            {
                x: 1.825,
                y: "MTOW"
            },
            {
                x: 1.825,
                y: "BEW"
            },
            {
                x: 1.727,
                y: "BEW"
            }
        ],
        summary: ['BEW', 'TOW', 'CG', '%MAC'],
        armToMAC(arm) {
            return (arm-1.405)/1.4
        }
    },
    store: {
        
    }
}