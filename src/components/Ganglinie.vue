<script setup>
import * as d3 from "d3"
import {ref, watch} from "vue";
const props = defineProps({
  datenReihe: Object  //array ref [{pnpInCm, echtwertInM, timestamp}]
})

const svgContainer = ref(null)
watch(() => props.datenReihe, (datenReihe) => {

  const filteredDatenReihe = datenReihe.filter(({echtwertInM}) => echtwertInM != null)
  if (filteredDatenReihe.length === 0) return
  const x = d3.scaleUtc(d3.extent(datenReihe, d => d.timestamp), [marginLeft, width - marginRight]);

  // Declare the y (vertical position) scale.
  const y = d3.scaleLinear().domain([d3.min(filteredDatenReihe, d => +d.echtwertInM)-1, d3.max(filteredDatenReihe, d => +d.echtwertInM)+1]).range([height - marginBottom, marginTop]);

  const y2 = d3.scaleLinear().domain([d3.min(filteredDatenReihe, d => +d.pnpInCm)-100, d3.max(filteredDatenReihe, d => +d.pnpInCm)+100]).range([height - marginBottom, marginTop]);

  // Declare the line generator.
  const line = d3.line()
      .x(d => x(d.timestamp))
      .y(d => y(d.echtwertInM))
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
      .call(g => g.select(".domain"))
      .call(g => g.append("text")
          .attr("x", -marginLeft)
          .attr("y", 40)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .style("font-size", "30px")
          .text("m. ü. NHN"));

  svg.append("g")
      .attr("transform", `translate(${width - marginRight},0)`)
      .call(d3.axisRight(y2).ticks(height / 80))
      .call(g => g.select(".domain"))
      .call(g => g.append("text")
          .attr("x", marginRight)
          .attr("y", 40)
          .attr("fill", "currentColor")
          .attr("text-anchor", "end")
          .style("font-size", "30px")
          .text("cm"));

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

  const minValue = d3.min(filteredDatenReihe, d => +d.echtwertInM);

// Draw the average line
  svg.append("line")
      .attr("x1", marginLeft)
      .attr("x2", width - marginRight)
      .attr("y1", y(minValue))
      .attr("y2", y(minValue))
      .attr("stroke", "blue")
      .attr("stroke-dasharray", "5 5")
      .attr("stroke-width", 2);


  const maxValue = d3.max(filteredDatenReihe, d => +d.echtwertInM);

// Draw the average line
  svg.append("line")
      .attr("x1", marginLeft)
      .attr("x2", width - marginRight)
      .attr("y1", y(maxValue))
      .attr("y2", y(maxValue))
      .attr("stroke", "red")
      .attr("stroke-dasharray", "5 5")
      .attr("stroke-width", 2);


  const meanValue = d3.mean(filteredDatenReihe, d => +d.echtwertInM);

// Draw the average line
  svg.append("line")
      .attr("x1", marginLeft)
      .attr("x2", width - marginRight)
      .attr("y1", y(meanValue))
      .attr("y2", y(meanValue))
      .attr("stroke", "green")
      .attr("stroke-dasharray", "5 5")
      .attr("stroke-width", 2);

  console.log(y2.domain())
  console.log(y2.range())
  console.log(y.clamp())

  const legendX = width - marginRight - 190; // Adjust horizontal position
  const legendY = marginTop + 20; // Adjust vertical position

  const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${legendX},${legendY})`);

// Background box for better readability
  legend.append("rect")
      .attr("width", 180)
      .attr("height", 90)
      .attr("fill", "white")
      .attr("stroke-width", 1)
      .style("opacity", 0.8);

// Legend items
  const entries = [
    { label: "Max", value: maxValue, color: "red" },
    { label: "Avg", value: meanValue, color: "green" },
    { label: "Min", value: minValue, color: "blue" }
  ];

  legend.selectAll("text.label")
      .data(entries)
      .join("text")
      .attr("class", "label")
      .attr("x", 10)
      .attr("y", (d, i) => 25 + i * 25)
      .style("font-size", "25px")
      .attr("fill", d => d.color)
      .text(d => `${d.label}:`);

  legend.selectAll("text.value")
      .data(entries)
      .join("text")
      .attr("class", "value")
      .attr("x", 170)
      .attr("text-anchor", "end")
      .attr("y", (d, i) => 25 + i * 25)
      .style("font-size", "25px")
      .attr("fill", d => d.color)
      .text(d => `${d.value.toFixed(2)} m`);

   svgContainer.value.appendChild(svg.node())
})

  // Declare the chart dimensions and margins.
  const width = 928;
  const height = 500;
  const marginTop = 50;
  const marginRight = 60;
  const marginBottom = 50;
  const marginLeft = 80;

  // Declare the x (horizontal position) scale.


</script>

<template>
  <div ref="svgContainer" v-show="datenReihe.length > 0"></div>
  <div v-show="datenReihe.length === 0"><br/>Keine Datenpunkte in den letzten 30 Tagen.</div>
</template>

<style scoped>

</style>
