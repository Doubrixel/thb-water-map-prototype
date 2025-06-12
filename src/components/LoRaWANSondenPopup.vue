<script setup>
import {CButton} from "@coreui/vue/dist/esm/components/button/index.js";
import {computed, onMounted, ref} from 'vue'
import Ganglinie from "@/components/Ganglinie.vue";

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
  return samples.filter(({value}) => value != null).map(({ts, value}) => ({ts: new Date(ts), value}))
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
  return dailyDataRef.value.findLast(({value}) => value != null) ?? {value: 99999} //todo: vernünftig handlen, wenn seit mehr als 1 monat keine Daten kamen
})

const pegelInMmToMueNHN = (pegelInMm) => {
  return (props.sonde.echtwert - pegelInMm / 100.0).toFixed(2)
}

</script>

<template>
  <h6>{{sonde.bezeichnung}}</h6>
    <table>
      <thead>
      <tr>
        <th/>
        <th>
          m. ü. NHN
        </th>
        <th>
          mm. ü. PNP
        </th>
        <th>
          Datum
        </th>
      </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            Aktuell
          </td>
          <td>
            {{ pegelInMmToMueNHN(lastDataPoint.value) }}
          </td>
          <td>
            {{ (sonde.pnp - lastDataPoint.value).toFixed(0) }}
          </td>
          <td>
            {{lastDataPoint.ts?.toLocaleString('de-DE', {day: '2-digit', month: '2-digit', year: 'numeric'})}}
          </td>
        </tr>

        <tr>
          <td>
            Min
          </td>
          <td>
            {{ pegelInMmToMueNHN(allTimeLow.value) }}
          </td>
          <td>
            {{ (sonde.pnp - allTimeLow.value).toFixed(0) }}
          </td>
          <td>
            {{allTimeLow.ts?.toLocaleString('de-DE', {day: '2-digit', month: '2-digit', year: 'numeric'})}}
          </td>
        </tr>

        <tr>
          <td>
            Max
          </td>
          <td>
            {{ pegelInMmToMueNHN(allTimeHigh.value) }}
          </td>
          <td>
            {{ (sonde.pnp - allTimeHigh.value).toFixed(0) }}
          </td>
          <td>
            {{allTimeHigh.ts?.toLocaleString('de-DE', {day: '2-digit', month: '2-digit', year: 'numeric'})}}
          </td>
        </tr>
      </tbody>
    </table>
  <Ganglinie :datenReihe="dailyDataRef"/>
  <p/>
  <CButton color="primary" size="sm" variant="ghost">Weitere Infos</CButton>
</template>

<style scoped>
img {
  width: 100%;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-family: sans-serif;
}

thead {
  background-color: #f2f2f2;
}

th,
td {
  text-align: left;
  border: 1px solid #ddd;
}

tr:nth-child(even) {
  background-color: #fafafa;
}

tr:hover {
  background-color: #f1f7ff;
}

th:first-child,
td:first-child {
  font-weight: bold;
}
</style>
