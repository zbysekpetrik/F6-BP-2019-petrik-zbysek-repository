<template>
  <v-snackbar
    style="margin: 20px"
    color="info"
    left
    bottom
    v-model="vmodel"
    multi-line
    :timeout="0"
  >
    <div @click="$emit('click')">
      To install the app on your iOS device in Safari:
      tap
      <v-img
        style="height: 20px; width: 15px; display: inline-block;"
        src="/img/icons/icon-share.png"
      ></v-img>&nbsp;and then Add to Home Screen
    </div>
  </v-snackbar>
</template>

<script>
export default {
    data() {
        return {
            vmodel: true
        }
    }
};
</script>