<template>
  <div>
    <l-map ref="map" v-model:zoom="zoom" :center="[52.414167, 12.554167]" :use-global-leaflet="false">
      <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          layer-type="base"
          name="OpenStreetMap"
          attribution='<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      ></l-tile-layer>
    </l-map>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";

export default {
  components: {
    LMap,
    LTileLayer,
  },
  data() {
    return {
      zoom: 14,
    };
  },
};
</script>

<style scoped>
div {
  height: 100%;
  width: 100%;
}
</style>
