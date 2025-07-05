<script setup>
import sonden from "@/res/sonden.json"
import pegelOnline from "@/res/pegelOnline.json"
import LoRaWANSondenPopup from "@/components/pageBody/map/sondenMarker/LoRaWANSondenPopup.vue";
import {CCard, CCardBody} from "@coreui/vue/dist/esm/components/card/index.js";
import PegelPopup from "@/components/pageBody/map/pegelOnlineMarker/PegelPopup.vue";
import {computed, onMounted, ref} from "vue";
import {store} from "@/store.js";
import {CButton} from "@coreui/vue/dist/esm/components/button/index.js";

const sondenGefiltert = computed(() => {
  return sonden.filter(({bezeichnung}) => {
    return store.selectedDataRows.some(({name}) => name === bezeichnung );
  })
})

const pegelOnlineGefiltert = computed(() => {
  return pegelOnline.filter(({name}) => {
    return store.selectedDataRows.some((dataRow) => name === dataRow.name );
  })
})

const totalPrecipitation = computed(() => {
  return store.precipationData.reduce((sum, entry) => sum + (entry.value ?? 0), 0)
})

// Format dates
const formatDate = (date) => date.toLocaleDateString('de-DE', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
})

const randomRainImage = ref(null)
const showMeme = ref(false)

onMounted(async () => {
  try {
    const res = await fetch('https://meme-api.com/gimme/rain')
    const data = await res.json()
    if (!data.nsfw) randomRainImage.value = data.url
  } catch (e) {
    console.error('Failed to fetch rain meme', e)
  }
})
</script>

<template>
  <div class="SensorOverview" >
    <CCard class="Karte" v-for="(sonde) in sondenGefiltert" :key="sonde.sensorId">
      <CCardBody>
        <LoRaWANSondenPopup  :sonde="sonde"/>
      </CCardBody>
    </CCard>
    <CCard class="Karte" v-for="(pegel) in pegelOnlineGefiltert" :key="pegel.uuid">
      <CCardBody>
        <PegelPopup  :pegel="pegel"/>
      </CCardBody>
    </CCard>
    <CCard class="Karte">
      <CCardBody>
        <h6>Gesamtniederschlag</h6>
        <div>
          <strong>Zeitraum:</strong>
          {{ formatDate(store.startDate) }} – {{ formatDate(store.endDate) }}
        </div>
        <div>
          <strong>Gesamtniederschlag:</strong>
          {{ totalPrecipitation.toFixed(1).replace('.', ',') }} mm
        </div>
        <CButton
            variant="outline"
            size="sm"
            class="mt-3"
            @click="showMeme = !showMeme"
        >
          Mehr Infos
        </CButton>

        <div v-if="showMeme && randomRainImage" style="margin-top: 1rem">
          <img
              :src="randomRainImage"
              alt="Rain meme"
              style="max-width: 100%; max-height: 250px; object-fit: contain; border-radius: 8px;"
          />
          <small style="display: block; margin-top: 0.5rem; color: #666;">
            (Verwendete APIs:
            <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">
              https://archive-api.open-meteo.com
            </a>,
            <a href="https://github.com/D3vd/Meme_Api" target="_blank" rel="noopener noreferrer">
              https://meme-api.com/gimme/rain
            </a>)
          </small>
        </div>
      </CCardBody>
    </CCard>
  </div>
</template>

<style scoped>
.SensorOverview {
  padding: 10px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  overflow-x: hidden;
  overflow-y: scroll;
  align-items: flex-start;
}
.Karte {
  width: 500px;
  margin: 10px;
  height: 475px;
}
</style>
