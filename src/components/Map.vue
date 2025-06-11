<template>
  <div class="mapHolder">
    <l-map ref="map" v-model:zoom="zoom" :center="[52.414167, 12.554167]" :use-global-leaflet="false">
      <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          layer-type="base"
          name="OpenStreetMap"
          attribution='<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      ></l-tile-layer>
      <SondenMarker v-for="(sonde) in sonden" :key="sonde['Sensor-ID']" :sonde="sonde"></sondenMarker>
    </l-map>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import {LMap, LMarker, LTileLayer, LTooltip, LPopup} from "@vue-leaflet/vue-leaflet";
import LoRaWANSondenTooltip from "@/components/LoRaWANSondenTooltip.vue";
import SondenMarker from "@/components/SondenMarker.vue";
import sonden from "@/res/sonden.json"


export default {
  components: {
    SondenMarker,
    LoRaWANSondenTooltip,
    LMap,
    LTileLayer,
    LMarker,
    LTooltip,
    LPopup
  },
  data() {
    return {
      zoom: 14,
      sonden
    };
  },
};
</script>

<style scoped>
.mapHolder {
  height: 100%;
  width: 100%;
  flex-grow: 0;
}
.leaflet-popup-content {
  width: 400px;
}
</style>
