<script setup>
import {ref, watch} from "vue";
import {appendMarkerLinesWithLegend, createBaseChart, insertDataRow} from "@/util/chartFunctions.js";
const props = defineProps({
  datenReihe: Object  //array ref [{pnpInCm, echtwertInM, timestamp}]
})

const svgContainer = ref(null)

const dimensions = {
   width: 928,
   height: 500,
   marginTop: 50,
   marginRight: 60,
   marginBottom: 110,
   marginLeft: 80
}

watch(() => props.datenReihe, (datenReihe) => {
  svgContainer.value.innerHTML = ''
  const filteredDatenReihe = datenReihe.filter(({echtwertInM}) => echtwertInM != null)
  if (filteredDatenReihe.length === 0) return
  const {svg, x, y} = createBaseChart(datenReihe, 25, dimensions, {useY2Axis: true, scaleAxisLabels: true})
  insertDataRow(svg, x, y, filteredDatenReihe, {showDataPoints: true})
  appendMarkerLinesWithLegend(svg, y, filteredDatenReihe, dimensions)
  svgContainer.value.appendChild(svg.node())
})
</script>

<template>
  <div ref="svgContainer" v-show="datenReihe.length > 0"></div>
  <div v-show="datenReihe.length === 0"><br/>Keine Datenpunkte im ausgewählten Zeitraum.</div>
</template>

<style scoped>

</style>
