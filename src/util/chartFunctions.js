import * as d3 from "d3";

export const createBaseChart = (datenReihe, bufferInCm, dimensions, {useY2Axis, scaleAxisLabels}) => {
    const svg = createBaseSvg(dimensions);
    const {x, y, y2} = createAxis(datenReihe, bufferInCm, dimensions)
    appendXAxis(x, svg, dimensions)
    appendYAxis(y, svg, dimensions, scaleAxisLabels)
    useY2Axis && appendY2Axis(y2, svg, dimensions)
    scaleAxisLabels && scaleTickLabels(svg)
    return {svg, x, y, y2: useY2Axis ? y2 : undefined}
}

export const insertDataRow = (svg, x, y, filteredDatenReihe, options) => {
    const lineGenerator = createLineGenerator(x, y)
    appendLine(svg, lineGenerator, x, y, filteredDatenReihe, options)
    options.showDataPoints && appendDataPointsWithTooltip(svg, filteredDatenReihe, x, y)
}

export const appendMarkerLinesWithLegend = (svg, y, filteredDatenReihe, dimensions) => {
    const minValue = d3.min(filteredDatenReihe, d => +d.echtwertInM);
    appendMarkerLine(svg, minValue, "blue", y, dimensions)
    const maxValue = d3.max(filteredDatenReihe, d => +d.echtwertInM);
    appendMarkerLine(svg, maxValue, "red", y, dimensions)
    const meanValue = d3.mean(filteredDatenReihe, d => +d.echtwertInM);
    appendMarkerLine(svg, meanValue, "green", y, dimensions)

    const entries = [
        { label: "Max", value: maxValue, color: "red" },
        { label: "Avg", value: meanValue, color: "green" },
        { label: "Min", value: minValue, color: "blue" }
    ];

    appendLegend(svg, entries, dimensions)
}

export const addLegend = (svg, dataRows, colorPalette, options = {}) => {
    const {
        x = 20,
        y = 20,
        itemHeight = 20,
        boxSize = 12,
        fontSize = 12,
        maxItemsPerColumn = 10,
        spacingX = 150
    } = options

    const legendGroup = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${x}, ${y})`)

    dataRows.forEach(({ name }, i) => {
        const color = colorPalette[i % colorPalette.length]

        const row = i % maxItemsPerColumn
        const col = Math.floor(i / maxItemsPerColumn)

        const legendItem = legendGroup.append("g")
            .attr("transform", `translate(${col * spacingX}, ${row * itemHeight})`)

        legendItem.append("rect")
            .attr("width", boxSize)
            .attr("height", boxSize)
            .attr("fill", color)

        legendItem.append("text")
            .attr("x", boxSize + 5)
            .attr("y", boxSize - 1)
            .attr("font-size", fontSize)
            .text(name)
    })
}

const createAxis = (allDataPoints, bufferInCm, {marginLeft, marginRight, marginBottom, marginTop, width, height}) => {
    const filteredDataPoints = allDataPoints.filter(({echtwertInM}) => echtwertInM != null)
    const x = d3.scaleUtc(d3.extent(allDataPoints, d => d.timestamp), [marginLeft, width - marginRight]);
    const y = d3.scaleLinear().domain([d3.min(filteredDataPoints, d => +d.echtwertInM)-bufferInCm/100, d3.max(filteredDataPoints, d => +d.echtwertInM)+bufferInCm/100]).range([height - marginBottom, marginTop]);
    const y2 = d3.scaleLinear().domain([d3.min(filteredDataPoints, d => +d.pnpInCm)-bufferInCm, d3.max(filteredDataPoints, d => +d.pnpInCm)+bufferInCm]).range([height - marginBottom, marginTop]);
    return {x, y, y2}
}

const createLineGenerator = (x, y) => {
    return d3.line()
        .x(d => x(d.timestamp))
        .y(d => y(d.echtwertInM))
        .curve(d3.curveMonotoneX)
}

const createBaseSvg = ({ width, height }) => {
    return d3.create("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet") // oder "xMinYMin meet"
        .style("width", "100%")
        .style("height", "100%")
}

const appendXAxis = (x, svg, {height, marginBottom, width}) => {
    const formatGermanDate = d3.timeFormat("%d.%m.%y")
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x).ticks(width / 120).tickSizeOuter(0).tickFormat(formatGermanDate))
        .selectAll("text")
        .attr("transform", "rotate(45)")         // 45 Grad drehen
        .style("text-anchor", "start")           // Text-Ausrichtung anpassen
        .attr("dx", "0.5em")                     // horizontaler Abstand
        .attr("dy", "0.25em")
}

const appendYAxis = (y, svg, {height, marginLeft}, scaleAxisLabels) => {
    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y).ticks(height / 80))
        .call(g => g.select(".domain"))
        .call(g => g.append("text")
            .attr("x", scaleAxisLabels ? -marginLeft : -25)
            .attr("y", 40)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .style("font-size", scaleAxisLabels ? "30px" : "12px")
            .text("m. ü. NHN"));
}

const appendY2Axis = (y2, svg, {width, marginRight, height}) => {
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
}

const appendLine = (svg, lineGenerator, x, y, filteredDatenReihe, {color, label}) => {
    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", color ? color : "steelblue")
        .attr("stroke-width", 3)
        .attr("d", lineGenerator(filteredDatenReihe));
}

const scaleTickLabels = (svg) => {
    svg.selectAll(".tick text").style("font-size", "30px");
}

const appendDataPointsWithTooltip = (svg, filteredDatenReihe, x, y) => {
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "white")
        .style("padding", "5px")
        .style("border", "1px solid steelblue")
        .style("border-radius", "5px")
        .style("pointer-events", "none")
        .style("opacity", 0);

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
}

const appendMarkerLine = (svg, value, color, y, {marginLeft, marginRight, width}) => {
    svg.append("line")
        .attr("x1", marginLeft)
        .attr("x2", width - marginRight)
        .attr("y1", y(value))
        .attr("y2", y(value))
        .attr("stroke", color)
        .attr("stroke-dasharray", "5 5")
        .attr("stroke-width", 2);
}

const appendLegend = (svg, entries, {width, marginRight, marginTop}) => {
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
}
