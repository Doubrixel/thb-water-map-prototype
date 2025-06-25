<script setup>
import DataComparisonChart from "@/components/pageBody/sensorComparison/DataComparisonChart.vue";
import {store} from "@/store.js";
import {ref, watchEffect} from "vue";
import {fetchData} from "@/services/precipationService.js";

const precipationData = ref([])

watchEffect(async () => {
  precipationData.value = await fetchData(store.startDate, store.endDate, store.interval)
})
</script>

<template>
  <div class="SensorComparison">
    <DataComparisonChart :dataRows="store.selectedDataRows" :precipationData="precipationData" />
  </div>
</template>

<style scoped>
.SensorComparison {
  width: 100%;
  display: flex;
  flex-direction: row;
}

.DataRowSelector {
  display: flex;
  flex-direction: column;
}
</style>
