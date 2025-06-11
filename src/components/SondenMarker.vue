<script setup>
import LoRaWANSondenTooltip from "@/components/LoRaWANSondenTooltip.vue";
import {LMarker, LPopup, LTooltip} from "@vue-leaflet/vue-leaflet";

defineProps({
  sonde: Object
})
</script>

<template>
  <l-marker :lat-lng="[sonde.GeoDaten.lat, sonde.GeoDaten.lon]" :name="sonde.Bezeichnung">
    <l-popup :options="{maxWidth: 400}"><LoRaWANSondenTooltip :sonde="sonde"/></l-popup>
    <l-tooltip>{{sonde.Bezeichnung}}</l-tooltip>
  </l-marker>
</template>

<style scoped>

</style>
