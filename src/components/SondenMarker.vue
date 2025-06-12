<script setup>
import LoRaWANSondenTooltip from "@/components/LoRaWANSondenTooltip.vue";
import {LMarker, LPopup, LTooltip} from "@vue-leaflet/vue-leaflet";

defineProps({
  sonde: Object
})
</script>

<template>
  <l-marker :lat-lng="[sonde.geoDaten.lat, sonde.geoDaten.lon]" :name="sonde.bezeichnung">
    <l-popup :options="{maxWidth: 400}"><LoRaWANSondenTooltip :sonde="sonde"/></l-popup>
    <l-tooltip>{{sonde.bezeichnung}}</l-tooltip>
  </l-marker>
</template>

<style scoped>

</style>
