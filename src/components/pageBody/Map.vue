<template>
  <div class="mapHolder">
    <l-map ref="map" v-model:zoom="zoom" :center="[52.41604, 12.60930]" :use-global-leaflet="false" @ready="onMapReady" :options="mapOptions">
      <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          layer-type="base"
          name="OpenStreetMap"
          attribution='<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      ></l-tile-layer>
      <l-geo-json
          v-if="polderGebiete"
          :geojson="polderGebiete"
          :options="{
            interactive: true,
            onEachFeature: onEachFeature,
            style: styleGeoJson
          }"
      />
      <SondenMarker v-for="(sonde) in sonden" :key="sonde.sensorId" :sonde="sonde" :highlight="isHighlighted(sonde.bezeichnung)"></sondenMarker>
      <PegelOnlineMarker v-for="(pegel) in pegelOnline" :key="pegel.uuid" :pegel="pegel" :highlight="isHighlighted(pegel.name)"></PegelOnlineMarker>
    </l-map>
  </div>
</template>

<script>
import {control, DomUtil} from "leaflet";
import "leaflet/dist/leaflet.css";
import {LMap, LMarker, LTileLayer, LTooltip, LPopup, LGeoJson} from "@vue-leaflet/vue-leaflet";
import SondenMarker from "@/components/pageBody/map/SondenMarker.vue";
import sonden from "@/res/sonden.json"
import polderGebiete from "@/res/polder_4326.json"
import pegelOnline from "@/res/pegelOnline.json"
import PegelOnlineMarker from "@/components/pageBody/map/PegelOnlineMarker.vue";
import {store} from "@/store.js";


export default {
  components: {
    SondenMarker,
    PegelOnlineMarker,
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
      pegelOnline,
      mapOptions: {
        zoomAnimation: true,
        zoomAnimationThreshold: 4, // optional: sets when animation switches to instant
        wheelPxPerZoomLevel: 80, // smaller = faster zoom (default: 60)
        zoomSnap: 0.25,            // allows smoother steps (default: 1)
      }
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
    isHighlighted(bezeichnung) {
      return store.selectedDataRows.some(({name}) => bezeichnung === name)
    },
    addLegend() {
      const legend = control({ position: "bottomright" });
      legend.onAdd = function () {
        const div = DomUtil.create("div", "info legend");
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
    },
    onEachFeature(feature, layer) {
      const props = feature.properties || {};
      const name = props.GEBIET || props.Bereich || "Kein Name verfügbar";

      layer.bindPopup(`<strong>${name}</strong>`);
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
