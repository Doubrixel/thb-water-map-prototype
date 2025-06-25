<script setup>
import {LCircle, LMarker, LPopup, LTooltip} from "@vue-leaflet/vue-leaflet";
import PegelPopup from "@/components/pageBody/map/pegelOnlineMarker/PegelPopup.vue";

defineProps({
  pegel: Object,
  highlight: Boolean
})
</script>

<template>
  <l-marker :lat-lng="[pegel.geoDaten.lat, pegel.geoDaten.lon]" :name="pegel.name">
    <l-popup :options="{maxWidth: 400}"><PegelPopup :pegel="pegel"/></l-popup>
    <l-tooltip>{{pegel.name}}</l-tooltip>
  </l-marker>
  <l-circle
      v-if="highlight"
      :lat-lng="[pegel.geoDaten.lat, pegel.geoDaten.lon]"
      :radius="100"
      color="red"
      :fill-opacity="0.2"
  />
</template>

<style scoped>

</style>
