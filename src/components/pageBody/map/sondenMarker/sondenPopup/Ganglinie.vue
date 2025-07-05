<script setup>
import {ref, watch} from "vue";
import {appendMarkerLinesWithLegend, createBaseChart, insertDataRow} from "@/util/chartFunctions.js";
const props = defineProps({
  datenReihe: Object, //array ref [{pnpInCm, echtwertInM, timestamp}]
  mindestwasserstand: Number,
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

  if (typeof props.mindestwasserstand === 'number') {
    const mw = props.mindestwasserstand
    svg.append("line")
        .attr("x1", dimensions.marginLeft)
        .attr("x2", dimensions.width - dimensions.marginRight)
        .attr("y1", y(mw))
        .attr("y2", y(mw))
        .attr("stroke", "red")
        .attr("stroke-width", 2)

    svg.append("text")
        .attr("x", dimensions.marginLeft + 5)
        .attr("y", dimensions.height - dimensions.marginBottom - 20)
        .attr("dy", "0.35em")
        .style("fill", "red")
        .style("font-size", "24px")
        .text(`___ = Mindestwasserstand: ${mw.toFixed(2)} m`)
  }

  svgContainer.value.appendChild(svg.node())
})
</script>

<template>
  <div ref="svgContainer" v-show="datenReihe.length > 0"></div>
  <div v-show="datenReihe.length === 0"><br/>Keine Datenpunkte im ausgewählten Zeitraum.</div>
</template>

<style scoped>

</style>
