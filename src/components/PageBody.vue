<script setup>
import {CSidebar, CSidebarBrand, CSidebarFooter, CSidebarHeader, CSidebarNav, CSidebarToggler} from "@coreui/vue/dist/esm/components/sidebar/index.js";
import Map from "@/components/pageBody/Map.vue";
import SensorOverview from "@/components/pageBody/SensorOverview.vue";
import {CNavItem} from "@coreui/vue/dist/esm/components/nav/index.js";
import {COMPARISON, MAP, OVERVIEW, store} from "@/store.js";
import SensorComparison from "@/components/pageBody/SensorComparison.vue";
import TimespanSelector from "@/components/pageBody/TimespanSelector.vue";
import {computed, ref, watch, watchEffect} from "vue";
import sonden from "@/res/sonden.json";
import {fetchDataForDateRangeWithTimeWindow} from "@/services/sondenService.js";
import pegelOnline from "@/res/pegelOnline.json";
import {fetchDataForDateRangeWithTimeWindow as pegelFetch} from "@/services/pegelOnlineService.js";
import {fetchData} from "@/services/precipationService.js";

const DataRowTypes = {
  LORAWAN_SONDE: 'lorawan-sonde',
  PEGEL_ONLINE: 'pegelonline'
}

const lorawanDataRows = ref([])
const selectedDataRows = ref([])
const pegelDataRows = ref([])
const precipationData = ref([])

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
  precipationData.value = await fetchData(store.startDate, store.endDate, store.interval)
})

const allDataRows = computed(() => [...lorawanDataRows.value, ...pegelDataRows.value])

const selectableDataRows = computed(() => allDataRows.value.filter(({dataRow}) => dataRow.length > 0))

watch(selectableDataRows, () => {
  const prevSelectedNames = store.selectedDataRows.map(row => row.name)
  store.selectedDataRows = selectableDataRows.value.filter(({ name }) =>
      prevSelectedNames.includes(name)
  )
})
</script>

<template>
  <div class="page-body">
    <CSidebar>
      <CSidebarHeader class="border-bottom">
        <CSidebarBrand>THB Wasserkarte Prototyp</CSidebarBrand>
      </CSidebarHeader>
      <CSidebarNav class="border-bottom">
        <CNavItem href="#" @click="store.selectMap()" :class="{ selected: store.selectedTab === MAP }">
          Karte
        </CNavItem>
        <CNavItem href="#" @click="store.selectOverview()" :class="{ selected: store.selectedTab === OVERVIEW }">
          Übersicht
        </CNavItem>
        <CNavItem href="#" @click="store.selectComparison()" class="border-bottom" :class="{ selected: store.selectedTab === COMPARISON }">
          Vergleich
        </CNavItem>
        <CNavItem class="border-bottom">
          <b>Auswahlmenü</b>
          <div class="DataRowSelector" v-for="selectableDataRow in selectableDataRows">
            <label  :key="selectableDataRow.name">
              <input
                  type="checkbox"
                  :name="selectableDataRow.name"
                  :id="selectableDataRow.name"
                  :value="selectableDataRow"
                  v-model="store.selectedDataRows"
              />
              {{ selectableDataRow.name }}
            </label>
          </div>
          <br>
        </CNavItem>
        <CNavItem><TimespanSelector/></CNavItem>
      </CSidebarNav>
    </CSidebar>
    <Map v-show="store.selectedTab === MAP"/>
    <SensorOverview v-show="store.selectedTab === OVERVIEW"></SensorOverview>
    <SensorComparison v-show="store.selectedTab === COMPARISON"></SensorComparison>
  </div>
</template>

<style scoped>
.page-body {
  flex-grow: 0;
  height: 95vh;
  width: 100vw;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: stretch;
}
.sidebar {
  height: 95vh;
}
.selected {
  background-color: #e0f3ff; /* light blue highlight example */
}
</style>
