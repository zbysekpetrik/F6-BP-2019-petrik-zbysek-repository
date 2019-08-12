<template>
  <div>
    <div style="text-align:center; display: flex; align-items: center; height: -webkit-fill-available; justify-content: center">
      <div>
      <h1>Error 404</h1>
      <p>Page not found</p>
      <v-btn color="primary" @click="$router.push('/')">Return to hangar</v-btn>
      </div>
    </div>
    <v-layout style="position: fixed; bottom: 48px; left: 0px; right: 0px; margin: auto" row justify-center>
      <v-flex xs12 sm10 md7 lg6 xl5>
        <div style="padding: 10px 22px 0px 22px !important">
          <transition name="fade">
            <img style="width: 100%" src="/img/planes/generic-plane.png"></img>
          </transition>
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>
    
<style>
.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.2s;
}

.fade-enter-active {
  transition-delay: 0.2s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
