export default {
    WaB: {
        components: [
            { name: "Pilot and passenger", arm: 39, unit: "kg", toKg: 2.204622622, rule: [v => !!v || "Required!", v => v >= 0 || "Value below zero not allowed!"] },
            { name: "Fuel", arm: 42, unit: "L", toKg: 1.58503231415, rule: [v => !!v || "Required!", v => v >= 0 || "Value below zero not allowed!", v => v <= 85 || `Maximum volume: 85 L`] },
            { name: "Baggage area 1", arm: 64, unit: "kg", toKg: 2.204622622, rule: [v => (v >= 0 || v === undefined) || "Value below zero not allowed!", v => (v <= 54.4 || v === undefined) || `Maximum weight: 54,4 kg`] },
            { name: "Baggage area 2", arm: 84, unit: "kg", toKg: 2.204622622, rule: [v => (v >= 0 || v === undefined) || "Value below zero not allowed!", v => (v <= 18 || v === undefined) || `Maximum weight: 18 kg`] }],
        envelope: [
            {
                x: 31.5,
                y: "BEW"
            },
            {
                x: 31.5,
                y: 1280
            },
            {
                x: 32.9,
                y: "MTOW"
            },
            {
                x: 37.5,
                y: "MTOW"
            },
            {
                x: 37.5,
                y: "BEW"
            },
            {
                x: 31.5,
                y: "BEW"
            }
        ],
        summary: ['BEW', 'TOW', 'CG'],
        armToMAC() {
            return null
        }
    },
}