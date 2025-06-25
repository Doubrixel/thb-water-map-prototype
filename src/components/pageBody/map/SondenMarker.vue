<script setup>
import LoRaWANSondenPopup from "@/components/pageBody/map/sondenMarker/LoRaWANSondenPopup.vue";
import {LCircle, LMarker, LPopup, LTooltip} from "@vue-leaflet/vue-leaflet";

defineProps({
  sonde: Object,
  highlight: Boolean
})
</script>

<template>
  <l-marker :lat-lng="[sonde.geoDaten.lat, sonde.geoDaten.lon]" :name="sonde.bezeichnung">
    <l-popup :options="{maxWidth: 400}"><LoRaWANSondenPopup :sonde="sonde"/></l-popup>
    <l-tooltip>{{sonde.bezeichnung}}</l-tooltip>
  </l-marker>
  <l-circle
      v-if="highlight"
      :lat-lng="[sonde.geoDaten.lat, sonde.geoDaten.lon]"
      :radius="100"
      color="red"
      :fill-opacity="0.2"
  />
</template>

<style scoped>

</style>
