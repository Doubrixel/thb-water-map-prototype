<script setup>
import {ref, watch} from "vue";
import {addLegend, createBaseChart, insertDataRow} from "@/util/chartFunctions.js";
const props = defineProps({
  dataRows: Array  //array ref [{name, definition, type, dataRow: [{pnpInCm, echtwertInM, timestamp}]}]
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

const colorPalette = [
  "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728",
  "#9467bd", "#8c564b", "#e377c2", "#7f7f7f",
  "#bcbd22", "#17becf"
]

watch(() => props.dataRows, (dataRows) => {
  svgContainer.value.innerHTML = ''
  if (dataRows.length === 0) return null
  const allDataPoints = []
  dataRows.forEach(({dataRow}) => allDataPoints.push(...dataRow))
  const {svg, x, y} = createBaseChart(allDataPoints, 25, dimensions, {useY2Axis: false, scaleAxisLabels: false})

  dataRows.forEach(({name, dataRow}, index) => {
    const filteredDatenReihe = dataRow.filter(({echtwertInM}) => echtwertInM != null)
    if (filteredDatenReihe.length === 0) return
    const color = colorPalette[index % colorPalette.length]
    insertDataRow(svg, x, y, filteredDatenReihe, {showDataPoints: false, color, label: name})
  })

  addLegend(svg, dataRows, colorPalette, {
    x: dimensions.marginLeft + 20,
    y: dimensions.marginTop,
  })

  svgContainer.value.appendChild(svg.node())
})
</script>

<template>
  <div ref="svgContainer" v-show="dataRows.length > 0"></div>
  <div v-show="dataRows.length === 0"><br/>Keine Datenreihen ausgewählt</div>
</template>

<style scoped>

</style>
