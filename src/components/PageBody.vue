<script setup>
import {CSidebar, CSidebarFooter, CSidebarNav, CSidebarToggler} from "@coreui/vue/dist/esm/components/sidebar/index.js";
import Map from "@/components/Map.vue";
import {CNavItem} from "@coreui/vue/dist/esm/components/nav/index.js";
</script>

<template>
  <div class="page-body">
    <CSidebar>
      <CSidebarNav>
        <CNavItem href="#" >
          Karte
        </CNavItem>
        <CNavItem href="#">
          Sensorübersicht (i.A.)
        </CNavItem>
      </CSidebarNav>
      <!--<CSidebarFooter class="border-top">
        <CSidebarToggler/>
      </CSidebarFooter>-->
    </CSidebar>
    <Map/>
  </div>
</template>

<style scoped>
.page-body {
  flex-grow: 0;
  height: 100%;
  width: 100vw;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: stretch;
}
aside {
  height: 100%;
}
.sidebar {
  height: 100%;
}
</style>
