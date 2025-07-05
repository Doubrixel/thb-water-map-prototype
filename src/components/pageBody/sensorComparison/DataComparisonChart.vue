<script setup>
import {ref, watch, watchEffect} from "vue";
import * as d3 from "d3";
import {addLegend, createBaseChart, insertDataRow} from "@/util/chartFunctions.js";
const props = defineProps({
  dataRows: Array,  //array ref [{name, definition, type, dataRow: [{pnpInCm, echtwertInM, timestamp}]}]
  precipationData: Array //array ref [{timestamp, value}]
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

const renderChart = () => {
  const dataRows = props.dataRows
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

  if (props.precipationData.length > 0) {

    svg.append("defs")
        .append("clipPath")
        .attr("id", "clip-precip-bars")
        .append("rect")
        .attr("x", dimensions.marginLeft)
        .attr("y", dimensions.marginTop)
        .attr("width", dimensions.width - dimensions.marginLeft - dimensions.marginRight)
        .attr("height", dimensions.height - dimensions.marginTop - dimensions.marginBottom);

    const precipitationData = props.precipationData
        .filter(d => d.value != null)
        .map(d => ({ ...d, timestamp: new Date(d.timestamp) }));

    const y2 = d3.scaleLinear()
        .domain([0, d3.max(precipitationData, d => d.value)])
        .nice()
        .range([dimensions.height - dimensions.marginBottom, dimensions.marginTop]);

    svg.append("g")
        .attr("transform", `translate(${dimensions.width - dimensions.marginRight},0)`)
        .call(d3.axisRight(y2))
        .call(g => g.selectAll("text").attr("fill", "#1f78b4"))
        .call(g => g.selectAll("line").attr("stroke", "#1f78b4"))
        .append("text")
        .attr("fill", "#1f78b4")
        .attr("x", 0)
        .attr("y", 40)
        .attr("dy", "-1em")
        .attr("text-anchor", "middle")
        .text("Niederschlag in mm");

    let barWidth = 5;
    if (precipitationData.length > 1) {
      const n = precipitationData.length;
      barWidth = (x(precipitationData[n - 1].timestamp) - x(precipitationData[0].timestamp)) / (n - 1) * 0.9;
    }

  const tooltip = d3.select(svgContainer.value)
      .append("div")
      .style("position", "absolute")
      .style("pointer-events", "none")
      .style("background", "rgba(0,0,0,0.7)")
      .style("color", "white")
      .style("padding", "5px 8px")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("visibility", "hidden");


  svg.append("g")
      .attr("clip-path", "url(#clip-precip-bars)")
      .selectAll("rect")
      .data(precipitationData.slice(1))
      .join("rect")
      .attr("x", (d) => x(d.timestamp)-barWidth)
      .attr("y", d => Math.min(y2(d.value), y2(0)))
      .attr("width", barWidth)
      .attr("height", d => Math.abs(y2(0) - y2(d.value)))
      .attr("fill", "#1f78b4")
      .attr("opacity", 0.6)
      .on("mouseenter", (event, d, i) => {
        const index = precipitationData.findIndex(p => p.timestamp.getTime() === d.timestamp.getTime());
        const prev = precipitationData[index - 1];
        const format = d3.timeFormat("%Y-%m-%d");
        const from = prev ? format(prev.timestamp) : "Start";
        const to = format(d.timestamp);
        tooltip.style("visibility", "visible")
            .text(`${from} → ${to}: ${d.value.toFixed(2)} mm`);
      })
      .on("mousemove", (event) => {
        tooltip
            .style("top", (event.pageY - 30) + "px")
            .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseleave", () => {
        tooltip.style("visibility", "hidden");
      });
  }

  svgContainer.value.appendChild(svg.node())
}

watch(() => props.dataRows, renderChart, { deep: true })
watch(() => props.precipationData, renderChart, { deep: true })
</script>

<template>
  <div class="ComparisonChartContainer" ref="svgContainer" v-show="dataRows.length > 0"></div>
  <div v-show="dataRows.length === 0"><br/>Keine Datenreihen ausgewählt</div>
</template>

<style scoped>
.ComparisonChartContainer {
  width: 100%;
}
</style>
