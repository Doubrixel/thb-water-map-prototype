<script setup>
import sonden from "@/res/sonden.json"
import LoRaWANSondenPopup from "@/components/LoRaWANSondenPopup.vue";
import {CCard, CCardBody} from "@coreui/vue/dist/esm/components/card/index.js";
</script>

<template>
  <div class="SensorOverview" >
    <CCard class="Karte" v-for="(sonde) in sonden" :key="sonde.sensorId">
      <CCardBody>
        <LoRaWANSondenPopup  :sonde="sonde"/>
      </CCardBody>
    </CCard>
  </div>
</template>

<style scoped>
.SensorOverview {
  padding: 30px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  overflow: scroll;
}
.Karte {
  max-width: 30%;
  margin: 10px;
}
</style>
