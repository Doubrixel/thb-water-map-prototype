<script setup>
import {CButton} from "@coreui/vue/dist/esm/components/button/index.js";

defineProps({
  sonde: Object
})
</script>

<template>
  <h6>{{sonde.Bezeichnung}}</h6>
  <p>
    Letzter Stand: {{sonde.Echtwert}} m. ü. NHN ({{new Date().toLocaleString('de-DE')}})<br>
    Min: {{(sonde.Echtwert - Math.random()*5).toFixed(3)}} m. ü. NHN<br>
    Min: {{(sonde.Echtwert + Math.random()*5).toFixed(3)}} m. ü. NHN
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
