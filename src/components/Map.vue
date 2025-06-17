<template>
  <div class="mapHolder">
    <l-map ref="map" v-model:zoom="zoom" :center="[52.41604, 12.60930]" :use-global-leaflet="false">
      <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          layer-type="base"
          name="OpenStreetMap"
          attribution='<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      ></l-tile-layer>
      <l-geo-json
          v-if="polderGebiete"
          :geojson="polderGebiete"
          :options-style="styleGeoJson"
      ></l-geo-json>
      <SondenMarker v-for="(sonde) in sonden" :key="sonde.sensorId" :sonde="sonde"></sondenMarker>
    </l-map>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import {LMap, LMarker, LTileLayer, LTooltip, LPopup, LGeoJson} from "@vue-leaflet/vue-leaflet";
import SondenMarker from "@/components/SondenMarker.vue";
import sonden from "@/res/sonden.json"
import polderGebiete from "@/res/polder_4326.json"


export default {
  components: {
    SondenMarker,
    LMap,
    LTileLayer,
    LMarker,
    LTooltip,
    LPopup,
    LGeoJson
  },
  data() {
    return {
      zoom: 14,
      sonden,
      polderGebiete,
    };
  },
  methods: {
    styleGeoJson() {
      return {
        color: "blue",
        weight: 1,
        fillOpacity: 0.1
      };
    }
  }
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
