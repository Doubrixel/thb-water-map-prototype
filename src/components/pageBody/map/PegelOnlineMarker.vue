<script setup>
import {LMarker, LPopup, LTooltip} from "@vue-leaflet/vue-leaflet";
import PegelPopup from "@/components/pageBody/map/pegelOnlineMarker/PegelPopup.vue";

defineProps({
  pegel: Object
})
</script>

<template>
  <l-marker :lat-lng="[pegel.geoDaten.lat, pegel.geoDaten.lon]" :name="pegel.name">
    <l-popup :options="{maxWidth: 400}"><PegelPopup :pegel="pegel"/></l-popup>
    <l-tooltip>{{pegel.name}}</l-tooltip>
  </l-marker>
</template>

<style scoped>

</style>
