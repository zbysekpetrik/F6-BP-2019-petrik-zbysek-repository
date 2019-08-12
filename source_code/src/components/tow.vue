<template>
  <div>
    <v-card style="margin-bottom: 10px">
      <v-card-title style="padding-bottom: 0px">
        <h5>Weight</h5>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
            :rules="totalRule"
            type="number"
            label="TOW"
            suffix="kg"
            v-model="data.TOW"
            @input="change()"
          ></v-text-field>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  props: ["totalRule", "inputData"],
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
  watch: {
    inputData() {
      if (this.data === this.inputData) return;
      this.data = this.inputData;
    }
  }
};
</script>

