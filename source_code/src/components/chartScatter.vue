<template>
  <div style="background-color: white; border-radius: 4px; margin: 10px; padding: 10px">
    <canvas ref="chart-canvas"></canvas>
  </div>
</template>

<script>
import { sync } from "vuex-pathify";

import Chart from "chart.js";
export default {
  props: ["chartData"],
  data() {
    return {
      timeout: null,
      chartObj: null
    };
  },
  mounted() {
    this.renderChart();
    this.chartObj.update();
    this.saveChart()
  },
  computed: {
    selectedPlane: sync("selectedPlane")
  },
  methods: {
    saveChart() {
      let chartExport = this.$refs["chart-canvas"].toDataURL("image/PNG", 1.0);
      this.$store.commit(`${this.selectedPlane[0]}/W&B/chart`, chartExport);
    },
    renderChart() {
      if (this.chartObj !== null) return;
      let ctx = this.$refs["chart-canvas"].getContext("2d");
      this.chartObj = new Chart(ctx, {
        type: "scatter",
        data: {
          datasets: [
            {
              label: "TOW",
              data: this.chartData[0],
              borderColor: "blue",
              borderWidth: 1,
              pointBackgroundColor: "blue",
              pointBorderColor: "blue",
              pointRadius: 2,
              pointHoverRadius: 2,
              fill: false,
              tension: 0,
              showLine: true
            },
            {
              label: "Envelope",
              data: this.chartData[1],
              borderColor: "red",
              borderWidth: 2,
              pointBackgroundColor: "red",
              pointBorderColor: "red",
              pointRadius: 1,
              pointHoverRadius: 1,
              fill: false,
              tension: 0,
              showLine: true
            },
            {
              label: "Min FLT weight",
              data: this.chartData[2],
              borderColor: "purple",
              borderWidth: 1,
              pointBackgroundColor: "purple",
              pointBorderColor: "purple",
              pointRadius: 0,
              pointHoverRadius: 0,
              fill: false,
              tension: 0,
              showLine: true,
              borderDash: [10, 5]
            }
          ]
        },
        options: {
          legend: false,
          tooltips: false,
          responsive: true
        }
      });
      this.chartCardShow = true;
    },
    updateChart() {
      for (let i = 0; i < this.chartData.length; i++) {
        this.chartObj.data.datasets[i].data = this.chartData[i];
      }
      this.chartObj.update(0);
      let self = this
      this.timeout = setTimeout(function() {
        self.saveChart()
      }, 500);
    }
  },
  watch: {
    chartData() {
      clearTimeout(this.timeout);
      this.updateChart();
    }
  }
};
</script>
