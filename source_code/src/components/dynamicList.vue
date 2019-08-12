<template>
  <div>
    <v-list>
      <v-list-item v-for="item in items" :key="item.name">
        <v-list-item-content>
          <h4>{{item.name}}:</h4>
        </v-list-item-content>
        <v-list-item-content style="flex: initial !important;">{{item.value}}</v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
    props: ["items"]
};
</script>
