<script setup>
import {CButton} from "@coreui/vue/dist/esm/components/button/index.js";
import {computed, onMounted, ref} from 'vue'
import Ganglinie from "@/components/Ganglinie.vue";
import {fetchDataForPastInterval, fetchDataSince, fetchDataSinceWithTimeWindow, Interval, TimeWindow} from "@/services/sondenService.js";

const props = defineProps({
  sonde: Object
})

const weeklyDataRef = ref([])
const dailyDataRef = ref([])
const allTimeDataDailyRef = ref([])

onMounted(async () => {
  try {
    weeklyDataRef.value = await fetchDataSinceWithTimeWindow(props.sonde, new Date('2020-01-01'), TimeWindow.WEEK)
    dailyDataRef.value = await fetchDataForPastInterval(props.sonde, Interval.MONTH)
    allTimeDataDailyRef.value = await fetchDataSince(props.sonde, new Date('2020-01-01'))
  } catch (err) {
    console.error('Error fetching data:', err)
  }
})

const weeklyDataWithoutNulls = computed(() => weeklyDataRef.value.filter(({ echtwertInM }) => echtwertInM != null))

const allTimeHigh = computed(() => {
  if (weeklyDataWithoutNulls.value.length === 0) return null
  return weeklyDataWithoutNulls.value.reduce((acc, current) => acc.echtwertInM > current.echtwertInM ? acc : current)
})

const allTimeLow = computed(() => {
  if (weeklyDataWithoutNulls.value.length === 0) return null
  return weeklyDataWithoutNulls.value.reduce((acc, current) => acc.echtwertInM < current.echtwertInM ? acc : current)
})

const lastDataPoint = computed(() => {
  const allTimeDataDailyWithoutNulls = allTimeDataDailyRef.value.filter(({ echtwertInM }) => echtwertInM != null)
  if (allTimeDataDailyWithoutNulls.length === 0) return null
  return allTimeDataDailyWithoutNulls[allTimeDataDailyWithoutNulls.length - 1]
})

</script>

<template>
  <h6>{{sonde.bezeichnung}}</h6>
    <table>
      <thead>
      <tr>
        <th/>
        <th>
          Wasserstand + PNP
          absolut über Null
        </th>
        <th>
          Wasserstand
          relativ zum PNP
        </th>
        <th>
          Datum
        </th>
      </tr>
      </thead>
      <tbody>
        <tr v-if="lastDataPoint">
          <td>
            Aktuell
          </td>
          <td>
            {{ lastDataPoint.echtwertInM }} m. ü. NHN
          </td>
          <td>
            {{ lastDataPoint.pnpInCm }} cm
          </td>
          <td>
            {{lastDataPoint.timestamp?.toLocaleString('de-DE', {day: '2-digit', month: '2-digit', year: 'numeric'})}}
          </td>
        </tr>

        <tr v-if="allTimeLow">
          <td>
            Min
          </td>
          <td>
            {{ allTimeLow.echtwertInM }} m. ü. NHN
          </td>
          <td>
            {{ allTimeLow.pnpInCm }} cm
          </td>
          <td>
            {{allTimeLow.timestamp?.toLocaleString('de-DE', {day: '2-digit', month: '2-digit', year: 'numeric'})}}
          </td>
        </tr>

        <tr v-if="allTimeHigh">
          <td>
            Max
          </td>
          <td>
            {{ allTimeHigh.echtwertInM }} m. ü. NHN
          </td>
          <td>
            {{ allTimeHigh.pnpInCm }} cm
          </td>
          <td>
            {{allTimeHigh.timestamp?.toLocaleString('de-DE', {day: '2-digit', month: '2-digit', year: 'numeric'})}}
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
