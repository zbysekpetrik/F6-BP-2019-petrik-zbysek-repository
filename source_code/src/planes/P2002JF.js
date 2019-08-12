export default {
    WaB: {
        components: [
            { name: "Pilot and passenger", arm: 1.8, unit: "kg", toKg: 1, rule: [v => !!v || "Required!", v => v >= 0 || "Value below zero not allowed!"] },
            { name: "Fuel", arm: 1.66, unit: "L", toKg: 0.72, rule: [v => !!v || "Required!", v => v >= 0 || "Value below zero not allowed!", v => v <= 100 || `Maximum volume: 100 L`] },
            { name: "Baggage", arm: 2.2, unit: "kg", toKg: 1, rule: [v => (v >= 0 || v === undefined) || "Value below zero not allowed!", v => (v <= 20 || v === undefined) || `Maximum weight: 20 kg`] }],
        envelope: [
            {
                x: 1.693,
                y: "BEW"
            },
            {
                x: 1.693,
                y: "MTOW"
            },
            {
                x: 1.782,
                y: "MTOW"
            },
            {
                x: 1.782,
                y: "BEW"
            },
            {
                x: 1.693,
                y: "BEW"
            },
        ],
        summary: ['BEW', 'TOW', 'CG', '%MAC'],
        armToMAC(arm) {
            return (arm-1.337)/1.37
        }
    },
    store: {
        
    }
}