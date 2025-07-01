<script setup>
import {computed, onMounted, ref, watch} from 'vue'
import Ganglinie from "@/components/pageBody/map/sondenMarker/sondenPopup/Ganglinie.vue";
import {fetchDataForDateRangeWithTimeWindow, fetchDataSince, fetchDataSinceWithTimeWindow, Interval, TimeWindow} from "@/services/sondenService.js";
import {store} from "@/store.js";
import {CButton} from "@coreui/vue/dist/esm/components/button/index.js";
import {CTooltip} from '@coreui/vue/src/components/tooltip/CTooltip'


const props = defineProps({
  sonde: Object
})

const weeklyDataRef = ref([])
const selectedDateRangeDataRef = ref([])
const allTimeDataDailyRef = ref([])

onMounted(async () => {
  try {
    weeklyDataRef.value = await fetchDataSinceWithTimeWindow(props.sonde, new Date('2020-01-01'), TimeWindow.WEEK)
    allTimeDataDailyRef.value = await fetchDataSince(props.sonde, new Date('2020-01-01'))
    await updateSelectedDateRangeData()
  } catch (err) {
    console.error('Error fetching data:', err)
  }
})

const daysSinceLastValidDataPoint = computed(() => {
  const reversed = [...allTimeDataDailyRef.value].reverse()
  const lastValid = reversed.find(d => d.echtwertInM != null)

  if (!lastValid || !lastValid.timestamp) return Infinity

  const lastDate = new Date(lastValid.timestamp)
  if (isNaN(lastDate.getTime())) return Infinity

  const now = new Date()
  const msPerDay = 1000 * 60 * 60 * 24
  return Math.floor((now.getTime() - lastDate.getTime()) / msPerDay)
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
        props.sonde,
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
  <div class="TitleHolder">
    <h6>{{sonde.bezeichnung}} </h6>
    <CTooltip :content="daysSinceLastValidDataPoint > 1 ? 'Kein Datenpunkt in den letzten 24h' : 'Sonde aktiv'">
      <template #toggler="{ id, on }">
        <span v-on="on" :aria-describedby="id">
          {{daysSinceLastValidDataPoint > 1 ? "🔴" : "🟢"}}
        </span>
      </template>
    </CTooltip>
  </div>
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
        :href="`https://map.ttn-brb.de/sensors/${sonde.sensorId}#water_level`"
        target="_blank"
        rel="noopener"
    >
      Quelle
    </a>
  </CButton>
</template>

<style scoped>
.TitleHolder {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
}
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
