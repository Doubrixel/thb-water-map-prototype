<template>
  <div class="mapHolder">
    <l-map ref="map" v-model:zoom="zoom" :center="[52.41604, 12.60930]" :use-global-leaflet="false" @ready="onMapReady">
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
import L from "leaflet";
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
    },
    addLegend() {
      const legend = L.control({ position: "bottomright" });
      legend.onAdd = function () {
        const div = L.DomUtil.create("div", "info legend");
        div.style.background = "white";       // weißer Hintergrund hinter allem
        div.style.padding = "6px 8px";        // etwas Padding für Abstand
        div.style.borderRadius = "4px";       // leichte Rundung für schöneres Aussehen
        div.style.boxShadow = "0 0 15px rgba(0,0,0,0.2)"; // leichter Schatten

        div.innerHTML = `
    <i style="
      border: 1px solid blue;    /* blauer Rand */
      background-color: rgba(0, 0, 255, 0.2); /* transparent innen */
      width: 18px;
      height: 18px;
      display: inline-block;
      margin-right: 8px;
      vertical-align: middle;
    "></i> Polder
  `;
        return div;
      };
      legend.addTo(this.$refs.map.leafletObject);
    },
    onMapReady() {
      this.addLegend();
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
