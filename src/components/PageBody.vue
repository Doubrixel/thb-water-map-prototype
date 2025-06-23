<script setup>
import {CSidebar, CSidebarBrand, CSidebarFooter, CSidebarHeader, CSidebarNav, CSidebarToggler} from "@coreui/vue/dist/esm/components/sidebar/index.js";
import Map from "@/components/pageBody/Map.vue";
import SensorOverview from "@/components/pageBody/SensorOverview.vue";
import {CNavItem} from "@coreui/vue/dist/esm/components/nav/index.js";
import {COMPARISON, MAP, OVERVIEW, store} from "@/store.js";
import SensorComparison from "@/components/pageBody/SensorComparison.vue";
import TimespanSelector from "@/components/pageBody/TimespanSelector.vue";
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
