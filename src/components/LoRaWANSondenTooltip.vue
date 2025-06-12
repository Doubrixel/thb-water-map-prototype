<script setup>
import {CButton} from "@coreui/vue/dist/esm/components/button/index.js";
import {computed, onMounted, ref} from 'vue'

const props = defineProps({
  sonde: Object
})

// Generate time range: last 30 days
const now = new Date()
const end = now.toISOString().slice(0, 16) + 'Z'
const startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
const start = startDate.toISOString().slice(0, 16) + 'Z'

// Build URL
const uuid = props.sonde.sensorId
//todo https://map.ttn-brb.de antatt /api für prod
const baseUrl = `/api/api/v0/sensors/${uuid}/series/water_level/data`
const allDataWeeklyUrl = `${baseUrl}?start=${encodeURIComponent('2020-01-01T11:00Z')}&end=${encodeURIComponent(end)}&window=10080`
const dailyDataUrl = `${baseUrl}?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&window=1440`

const weeklyDataRef = ref([])
const dailyDataRef = ref([])


const cleanData = ({samples}) => {
  return samples.filter(({value}) => value != null).map(({ts, value}) => ({ts, value}))
}
// Fetch data
onMounted(async () => {
  try {
    const response = await fetch(allDataWeeklyUrl)
    const data = await response.json();
    weeklyDataRef.value = cleanData(data);

    const dailyResponse = await fetch(dailyDataUrl)
    const dailyData = await dailyResponse.json();
    dailyDataRef.value = cleanData(dailyData);
  } catch (err) {
    console.error('Error fetching data:', err)
  }
})

const allTimeHigh = computed(() => {
  return weeklyDataRef.value.reduce((acc, current) => acc?.value < current.value ? acc : current, {value: 99999})
})

const allTimeLow = computed(() => {
  return weeklyDataRef.value.reduce((acc, current) => acc?.value > current.value ? acc : current, {value: -99999})
})

const lastDataPoint = computed(() => {
  return dailyDataRef.value.findLast(({value}) => value != null) ?? {value: 99999}
})

const pegelInMmToMueNHN = (pegelInMm) => {
  return (props.sonde.echtwert - pegelInMm / 100.0).toFixed(2)
}

</script>

<template>
  <h6>{{sonde.bezeichnung}}</h6>
  <p>
    Letzter Stand: {{ pegelInMmToMueNHN(lastDataPoint.value) }} m. ü. NHN ({{new Date(lastDataPoint.ts).toLocaleString('de-DE', {day: '2-digit', month: '2-digit', year: 'numeric'})}})<br>
    Min: {{ pegelInMmToMueNHN(allTimeLow.value) }} m. ü. NHN ({{new Date(allTimeLow.ts).toLocaleDateString('de-DE', {day: '2-digit', month: '2-digit', year: 'numeric'})}})<br>
    Max: {{ pegelInMmToMueNHN(allTimeHigh.value) }} m. ü. NHN ({{new Date(allTimeHigh.ts).toLocaleDateString('de-DE', {day: '2-digit', month: '2-digit', year: 'numeric'})}})
  </p>
  <img src="https://www.wasserstaende.de/webservices/rest-api/v2/stations/593647aa-9fea-43ec-a7d6-6476a76ae868/W/measurements.png?start=P30D" alt="Ganglinie letzte 30 Tage">
  <p/>
  <CButton color="primary" size="sm" variant="ghost">Weitere Infos</CButton>
</template>

<style scoped>
img {
  width: 100%;
}
</style>
