<script setup>
import LoRaWANSondenPopup from "@/components/LoRaWANSondenPopup.vue";
import {LMarker, LPopup, LTooltip} from "@vue-leaflet/vue-leaflet";

defineProps({
  sonde: Object
})
</script>

<template>
  <l-marker :lat-lng="[sonde.geoDaten.lat, sonde.geoDaten.lon]" :name="sonde.bezeichnung">
    <l-popup :options="{maxWidth: 400}"><LoRaWANSondenPopup :sonde="sonde"/></l-popup>
    <l-tooltip>{{sonde.bezeichnung}}</l-tooltip>
  </l-marker>
</template>

<style scoped>

</style>
