<template>
  <v-bottom-navigation
    grow
    style="position: none;"
  >
    <div style="color: white !important; padding: 0 16px;" class="noopacity v-btn" height="56px" value="f-air">
      <img style="width: 80px;" src="/img/icons/fair.svg" alt />
    </div>
    <v-btn class="noopacity" height="56px" v-on:click="planeClick" value="plane">
      <span>{{ middleValue }}</span>
    </v-btn>

    <v-btn class="noopacity" height="56px" to="/" value="hangar">
      <img class="kareta" style="width: 65px;" src="/img/icons/house.svg" alt />
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
    props: ['middleValue'],
    methods: {
      planeClick() {
        this.$emit("plane-click")
      }
    }
}
</script>