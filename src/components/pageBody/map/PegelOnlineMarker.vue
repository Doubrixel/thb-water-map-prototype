<script setup>
import {LCircle, LMarker, LPopup, LTooltip} from "@vue-leaflet/vue-leaflet";
import PegelPopup from "@/components/pageBody/map/pegelOnlineMarker/PegelPopup.vue";
import {icon} from "leaflet";

defineProps({
  pegel: Object,
  highlight: Boolean
})



const redIcon = icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
</script>

<template>
  <l-marker :lat-lng="[pegel.geoDaten.lat, pegel.geoDaten.lon]" :name="pegel.name" :icon="redIcon">
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
