<script setup>
import {computed, onMounted, ref, watch} from 'vue'
import Ganglinie from "@/components/pageBody/map/sondenMarker/sondenPopup/Ganglinie.vue";
import {TimeWindow} from "@/services/sondenService.js";
import {fetchDataForDateRangeWithTimeWindow, fetchDataSince, fetchDataSinceWithTimeWindow} from "@/services/pegelOnlineService.js";
import {store} from "@/store.js";
import {CButton} from "@coreui/vue/dist/cjs/components/button/index.js";

const props = defineProps({
  pegel: Object
})

const weeklyDataRef = ref([])
const selectedDateRangeDataRef = ref([])
const allTimeDataDailyRef = ref([])

onMounted(async () => {
  try {
    weeklyDataRef.value = await fetchDataSinceWithTimeWindow(props.pegel, new Date('2020-01-01'), TimeWindow.WEEK)
    allTimeDataDailyRef.value = await fetchDataSince(props.pegel, new Date('2020-01-01'))
    await updateSelectedDateRangeData()
  } catch (err) {
    console.error('Error fetching data:', err)
  }
})

watch(
    () => [store.startDate, store.endDate, store.interval],
    async () => {
      await updateSelectedDateRangeData()
    }
)

const updateSelectedDateRangeData = async () => {
  try {
    selectedDateRangeDataRef.value = await fetchDataForDateRangeWithTimeWindow(
        props.pegel,
        store.startDate,
        store.endDate,
        store.interval
    )
  } catch (err) {
    console.error('Fehler beim Laden der Daten zum ausgewählten Zeitraum:', err)
  }
}


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
  <h6>{{pegel.name}}</h6>
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
  <Ganglinie :datenReihe="selectedDateRangeDataRef"/>
  <CButton variant="outline" size="sm">
    <a
        :href="pegel.link"
        target="_blank"
        rel="noopener"
    >
      Quelle
    </a>
  </CButton> (Zeitraum max. letzte 30 Tage)
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
