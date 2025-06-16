<script setup>

import {store} from "../store.js";
</script>

<template>
  <div class="SensorComparison">
  <div class="SensorComparison">Vergleich</div>
  <div>{{store.startDate}}</div>
  <div>{{store.endDate}}</div>
  </div>
</template>

<style scoped>
.SensorComparison {
  width: 100%;
}
</style>
