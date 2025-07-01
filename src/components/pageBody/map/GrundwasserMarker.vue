<script setup>
import {LCircle, LMarker, LPopup, LTooltip} from "@vue-leaflet/vue-leaflet";
import PegelPopup from "@/components/pageBody/map/pegelOnlineMarker/PegelPopup.vue";
import {icon} from "leaflet";
import {CButton} from "@coreui/vue/dist/cjs/components/button/index.js";

defineProps({
  grundwasser: Object
})



const greenIcon = icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
</script>

<template>
  <l-marker :lat-lng="[grundwasser.lat, grundwasser.lng]" :name="grundwasser.name" :icon="greenIcon">
    <l-tooltip>{{grundwasser.name}}</l-tooltip>
    <l-popup><CButton variant="outline" size="sm">
      <a
          :href="grundwasser.link"
          target="_blank"
          rel="noopener"
      >
        {{grundwasser.name}}
      </a>
    </CButton></l-popup>
  </l-marker>
</template>

<style scoped>

</style>
