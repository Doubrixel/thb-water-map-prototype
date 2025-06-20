<script setup>
import sonden from "@/res/sonden.json"
import pegelOnline from "@/res/pegelOnline.json"
import LoRaWANSondenPopup from "@/components/pageBody/map/sondenMarker/LoRaWANSondenPopup.vue";
import {CCard, CCardBody} from "@coreui/vue/dist/esm/components/card/index.js";
import PegelPopup from "@/components/pageBody/map/pegelOnlineMarker/PegelPopup.vue";
</script>

<template>
  <div class="SensorOverview" >
    <CCard class="Karte" v-for="(sonde) in sonden" :key="sonde.sensorId">
      <CCardBody>
        <LoRaWANSondenPopup  :sonde="sonde"/>
      </CCardBody>
    </CCard>
    <CCard class="Karte" v-for="(pegel) in pegelOnline" :key="pegel.uuid">
      <CCardBody>
        <PegelPopup  :pegel="pegel"/>
      </CCardBody>
    </CCard>
  </div>
</template>

<style scoped>
.SensorOverview {
  padding: 10px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  overflow-x: hidden;
  overflow-y: scroll;
  align-items: flex-start;
}
.Karte {
  width: 500px;
  margin: 10px;
}
</style>
