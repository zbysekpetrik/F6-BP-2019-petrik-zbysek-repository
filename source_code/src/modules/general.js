import { uuid } from "vue-idb";

export const calcMixin = {
    components: {
        "flycalc-dynamic-list": () =>
            import(
            /* webpackChunkName: "flycalc-dynamic-list" */ "@/components/dynamicList.vue"
            ),
        "flycalc-tow": () =>
            import(/* webpackChunkName: "flycalc-tow" */ "@/components/tow.vue"),
        "flycalc-rwy-condition": () =>
            import(
            /* webpackChunkName: "flycalc-rwy-condition" */ "@/components/rwy.vue"
            ),
        "flycalc-meteo-condition": () =>
            import(
            /* webpackChunkName: "flycalc-meteo-condition" */ "@/components/meteo.vue"
            ),
        "flycalc-chart-scatter": () =>
            import(
            /* webpackChunkName: "flycalc-chart-scatter" */ "@/components/chartScatter.vue"
            ),
        "flycalc-chart-bar": () =>
            import(
            /* webpackChunkName: "flycalc-chart-bar" */ "@/components/chartBar.vue"
            ),
        "flycalc-incomplete-data": () =>
            import(
            /* webpackChunkName: "flycalc-incomplete-data" */ "@/components/nothingToCalculate.vue"
            )
    },
    beforeCreate() {
        if (this.$store.state[this.$route.params.plane] === undefined) {
            this.$store.registerModule(this.$route.params.plane, {
                namespaced: true,
                state: {
                    WaB: { componentsArray: [], results: {}, chart: null },
                    TO: {},
                    cruise: { PERF: {}, ROC: {} },
                    LD: {}
                },
                getters: {
                    "": state => {
                        return state;
                    },
                    "W&B": state => {
                        return state.WaB;
                    },
                    "W&B/componentsArray": state => {
                        return state.WaB.componentsArray;
                    },
                    "W&B/chart": state => {
                        return state.WaB.chart;
                    },
                    TO: state => {
                        return state.TO;
                    },
                    LD: state => {
                        return state.LD;
                    },
                    "cruise/PERF": state => {
                        return state.cruise.PERF;
                    },
                    "cruise/ROC": state => {
                        return state.cruise.ROC;
                    }
                },
                mutations: {
                    [`W&B/results`](state, payload) {
                        state.WaB.results = payload;
                    },
                    [`W&B/componentsArray`](state, payload) {
                        state.WaB.componentsArray = payload;
                    },
                    [`W&B/chart`](state, payload) {
                        state.WaB.chart = payload;
                    },
                    [`TO`](state, payload) {
                        state.TO = payload;
                    },
                    [`LD`](state, payload) {
                        state.LD = payload;
                    },
                    [`cruise/PERF`](state, payload) {
                        state.cruise.PERF = payload;
                    },
                    [`cruise/ROC`](state, payload) {
                        state.cruise.ROC = payload;
                    }
                }
            });
        }
    },
    methods: {
        printPDF() {
            this.printPDFfunction(
                this.$store.getters[this.selectedPlane[0] + "/"],
                this.selectedPlane[0],
                this.planeInfo.weight.BEW.value
            );
        },
        saveToIDB() {
            this.$db.user_config.add({
                id: uuid(),
                data: this.$store.getters[`${this.selectedPlane[0]}/`],
                plane: this.selectedPlane[0],
                username: "",
                created_at: new Date()
            });
        },
        loadConfig() {
            this.planeInfo = this.json[this.selectedPlane[1]][this.selectedPlane[0]];
            import(`@/planes/${this.planeInfo.plane}.js`).then(module => {
                this.plane = module.default;
                this.printPDFfunction = module.default.printPDF
                if (Object.keys(this.plane).includes(this.planeInfo.config)) {
                    this.plane = this.plane[this.planeInfo.config];
                }
                let temp = [];
                temp.push(!("WaB" in this.plane));
                temp.push(!("TO" in this.plane));
                temp.push(!("cruise" in this.plane));
                temp.push(!("LD" in this.plane));
                this.bottomNavDisabled = temp;
                return;
            });
        },
    }
}