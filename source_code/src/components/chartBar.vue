<template>
  <div
    style="border-radius: 4px; margin: 10px !important; padding: 10px !important"
    :class="{'lightGrey': colorMode}"
  >
    <canvas ref="chart-canvas"></canvas>
  </div>
</template>

<script>
import { sync } from "vuex-pathify";

import Chart from "chart.js";
export default {
  props: ["chartData", "chartLabels", "chartColors", "colorMode"],
  data() {
    return {
      chartObj: null
    };
  },
  mounted() {
    this.renderChart();
    this.chartObj.update();
  },
  computed: {
    selectedPlane: sync("selectedPlane")
  },
  methods: {
    renderChart() {
      Chart.defaults.global.tooltips.enabled = false;
      if (this.chartObj !== null) return;
      var data = {
        labels: this.chartLabels,
        datasets: [
          {
            data: this.chartData,
            backgroundColor: this.chartColors
          }
        ]
      };
      let ctx = this.$refs["chart-canvas"].getContext("2d");
      this.chartObj = new Chart(ctx, {
        type: "horizontalBar",
        data: data,
        options: {
          scales: {
            xAxes: [
              {
                ticks: {
                  min: 0 // Edit the value according to what you need
                }
              }
            ],
            yAxes: [
              {
                barPercentage: 0.4
              }
            ]
          },
          legend: {
            display: false
          },
          tooltips: {
            callbacks: {
              label: function(tooltipItem) {
                return tooltipItem.yLabel;
              }
            }
          }
        }
      });
    },
    updateChart() {
      this.chartObj.data.datasets[0].data = this.chartData;
      this.chartObj.update();
    }
  },
  watch: {
    chartData() {
      this.updateChart();
    }
  }
};
</script>

<style>
.lightGrey {
  background-color: rgb(219, 219, 219) !important;
}
</style>
