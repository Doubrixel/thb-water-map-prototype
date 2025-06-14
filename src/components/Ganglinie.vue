<script setup>
import * as d3 from "d3"
import {ref, watch} from "vue";
const props = defineProps({
  datenReihe: Object  //array ref [{pnpInCm, echtwertInM, timestamp}]
})

const svgContainer = ref(null)
watch(() => props.datenReihe, (datenReihe) => {

  const filteredDatenReihe = datenReihe.filter(({echtwertInM}) => echtwertInM != null)
  const x = d3.scaleUtc(d3.extent(datenReihe, d => d.timestamp), [marginLeft, width - marginRight]);

  // Declare the y (vertical position) scale.
  const y = d3.scaleLinear().domain([0, d3.max(filteredDatenReihe, d => d.echtwertInM)]).range([height - marginBottom, marginTop]);

  // Declare the line generator.
  const line = d3.line()
      .x(d => x(d.timestamp))
      .y(d => y(d.echtwertInM))
      .defined(d => d.echtwertInM != null)
      .curve(d3.curveMonotoneX)

  // Create the SVG container.
  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  const formatGermanDate = d3.timeFormat("%d.%m.")
  // Add the x-axis.
  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).ticks(width / 120).tickSizeOuter(0).tickFormat(formatGermanDate))

  // Add the y-axis, remove the domain line, add grid lines and a label.
  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).ticks(height / 80))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").clone()
          .attr("x2", width - marginLeft - marginRight)
          .attr("stroke-opacity", 0.3))
      .call(g => g.append("text")
          .attr("x", -marginLeft)
          .attr("y", 40)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .style("font-size", "30px")
          .text("m. ü. NHN"));

  svg.selectAll(".tick text").style("font-size", "30px");

  // Append a path for the line.
  svg.append("path")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 3)
      .attr("d", line(filteredDatenReihe));
  //
  const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "white")
      .style("padding", "5px")
      .style("border", "1px solid steelblue")
      .style("border-radius", "5px")
      .style("pointer-events", "none")
      .style("opacity", 0);

// Punkte hinzufügen
  svg.selectAll("circle")
      .data(filteredDatenReihe) // dein Datenarray
      .join("circle")
      .attr("cx", d => x(d.timestamp))
      .attr("cy", d => y(d.echtwertInM))
      .attr("r", 8)
      .attr("fill", "steelblue")
      .on("mouseover", (event, d) => {
        tooltip.style("opacity", 1)
            .html(`${d.timestamp.toLocaleString('de-DE', {day: '2-digit', month: '2-digit', year: 'numeric'})}<br/>${d.echtwertInM} m. ü. NHN<br/>${d.pnpInCm} cm`);
      })
      .on("mousemove", (event) => {
        tooltip.style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });

   svgContainer.value.appendChild(svg.node())
})

  // Declare the chart dimensions and margins.
  const width = 928;
  const height = 500;
  const marginTop = 50;
  const marginRight = 30;
  const marginBottom = 50;
  const marginLeft = 40;

  // Declare the x (horizontal position) scale.


</script>

<template>
  <div ref="svgContainer" v-show="datenReihe.length > 0"></div>
  <div v-show="datenReihe.length === 0"><br/>Keine Datenpunkte in den letzten 30 Tagen.</div>
</template>

<style scoped>

</style>
