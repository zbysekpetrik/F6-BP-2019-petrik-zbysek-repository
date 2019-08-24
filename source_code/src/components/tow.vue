<template>
  <div>
    <v-card style="margin-bottom: 10px">
      <v-card-title style="padding-bottom: 0px">
        <h5>Weight</h5>
      </v-card-title>
      <v-card-text>
        <v-text-field
          :rules="[validation]"
          :success="success"
          type="number"
          label="TOW"
          suffix="kg"
          v-model="data.TOW"
          @input="change()"
        ></v-text-field>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  props: ["inputData", "tow", "bew"],
  created() {
    this.data = this.inputData;
    this.change();
  },
  data: function() {
    return {
      data: {}
    };
  },
  methods: {
    change(foo) {
      foo = this.data;
      this.$emit("change", foo);
    }
  },
  computed: {
    validation() {
      if (this.tow < this.data.TOW) {
        return `MTOW: ${this.tow} kg`;
      } else if (this.data.TOW < this.bew && this.data.TOW !== null) {
        return `BEW: ${this.bew} kg`;
      }
      return false;
    },
    success() {
      if (this.tow >= this.data.TOW && this.data.TOW >= this.bew) return true;
      return false;
    }
  },
  watch: {
    inputData() {
      if (this.data === this.inputData) return;
      this.data = this.inputData;
    }
  }
};
</script>

