<script setup>

import {store} from "@/store.js";
import sonden from "@/res/sonden.json"
import pegelOnline from "@/res/pegelOnline.json"
import {fetchDataForDateRangeWithTimeWindow} from "@/services/sondenService.js";
import {fetchDataForDateRangeWithTimeWindow as pegelFetch} from "@/services/pegelOnlineService.js";
import {computed, ref, watch, watchEffect} from "vue";
import DataComparisonChart from "@/components/pageBody/sensorComparison/DataComparisonChart.vue";

const DataRowTypes = {
  LORAWAN_SONDE: 'lorawan-sonde',
  PEGEL_ONLINE: 'pegelonline'
}

const lorawanDataRows = ref([])
const selectedDataRows = ref([])
const pegelDataRows = ref([])

watchEffect(async () => {
  lorawanDataRows.value = await Promise.all(
      sonden.map(async (sonde) => ({
        name: sonde.bezeichnung,
        definition: sonde,
        type: DataRowTypes.LORAWAN_SONDE,
        dataRow: await fetchDataForDateRangeWithTimeWindow(
            sonde,
            store.startDate,
            store.endDate,
            store.interval
        ),
      }))
  )
  pegelDataRows.value = await Promise.all(
      pegelOnline.map(async (pegel) => ({
        name: pegel.name,
        definition: pegel,
        type: DataRowTypes.PEGEL_ONLINE,
        dataRow: await pegelFetch(
            pegel,
            store.startDate,
            store.endDate,
            store.interval
        ),
      }))
  )
})



const allDataRows = computed(() => [...lorawanDataRows.value, ...pegelDataRows.value])

const selectableDataRows = computed(() => allDataRows.value.filter(({dataRow}) => dataRow.length > 0))

watch(selectableDataRows, () => {
  const prevSelectedNames = selectedDataRows.value.map(row => row.name)
  selectedDataRows.value = selectableDataRows.value.filter(({ name }) =>
      prevSelectedNames.includes(name)
  )
})

</script>

<template>
  <div class="SensorComparison">
    <div class="DataRowSelector">
      <label v-for="selectableDataRow in selectableDataRows" :key="selectableDataRow.name">
        <input
            type="checkbox"
            :name="selectableDataRow.name"
            :id="selectableDataRow.name"
            :value="selectableDataRow"
            v-model="selectedDataRows"
        />
        {{ selectableDataRow.name }}
      </label>
    </div>
    <DataComparisonChart :dataRows="selectedDataRows"/>
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
