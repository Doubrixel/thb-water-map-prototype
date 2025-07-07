<script setup>
import DataComparisonChart from "@/components/pageBody/sensorComparison/DataComparisonChart.vue";
import {store} from "@/store.js";
import {ref, watchEffect} from "vue";
import {fetchData} from "@/services/precipationService.js";

const precipationData = ref([])

watchEffect(async () => {
  precipationData.value = await fetchData(store.startDate, store.endDate, store.interval)
  store.precipationData = precipationData.value
})
</script>

<template>
  <div class="ComparisonHolder">
    <div class="SensorComparison">
      <DataComparisonChart :dataRows="store.selectedDataRows" :precipationData="precipationData" />
    </div>
    Für Messstellen des Wasserstraßen- und Schifffahrtsamts stehen nur Daten für die letzten 30 Tage zur Verfügung.
  </div>
</template>

<style scoped>
.SensorComparison {
  width: 100%;
  display: flex;
  flex-direction: row;
  height: 96%;
}

.ComparisonHolder {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-left: 10px;
}
</style>
