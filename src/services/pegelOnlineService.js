import {TimeWindow} from "@/services/sondenService.js";

export const fetchDataForDateRangeWithTimeWindow = async (messStelle, beginDate, endDate, timeWindow) => {
    const url = buildUrl(messStelle, beginDate, endDate, timeWindow)
    const response = await fetch(url)
    const rawData = await response.json()
    return processData(rawData, messStelle, timeWindow)
}

export const fetchDataForDateRange = async (messStelle, beginDate, endDate) => {
    return await fetchDataForDateRangeWithTimeWindow(messStelle, beginDate, endDate, TimeWindow.DAY)
}

export const fetchDataSince = async (messStelle, beginDate) => {
    return await fetchDataForDateRange(messStelle, beginDate, new Date())
}

export const fetchDataSinceWithTimeWindow = async (messStelle, beginDate, timeWindow) => {
    return await fetchDataForDateRangeWithTimeWindow(messStelle, beginDate, new Date(), timeWindow)
}

const buildUrl = (messStelle, beginDate) => {
    const { uuid } = messStelle
    const prefix = 'https://pegelonline.wsv.de'
    const baseUrl = prefix + `/webservices/rest-api/v2/stations/${uuid}/W/measurements.json`
    const urlParams = {
        start: dateToApiFormat(beginDate),
    }
    const queryString = new URLSearchParams(urlParams).toString()
    return `${baseUrl}?${queryString}`
}

const dateToApiFormat = (date) => {
    return date.toISOString().slice(0, 16)
}

// Achtung die folgende Funktion ist Vibe-Coded
const processData = (rawData, messStelle, intervalInMinutes) => {
    const { munhn } = messStelle;

    const calcEchtwert = (valueInCm) =>
        valueInCm != null ? (munhn + valueInCm / 100.0).toFixed(2) : null;

    const roundTimestampToInterval = (timestamp, intervalMin) => {
        const date = new Date(timestamp);
        const ms = date.getTime();
        const intervalMs = intervalMin * 60 * 1000;
        return new Date(Math.floor(ms / intervalMs) * intervalMs);
    };

    // Group by rounded timestamp
    const grouped = {};
    for (const { timestamp, value } of rawData) {
        const rounded = roundTimestampToInterval(timestamp, intervalInMinutes).toISOString();
        if (!grouped[rounded]) {
            grouped[rounded] = { timestamp: rounded, value };
        }
        // Optional: implement smarter conflict resolution (e.g., take latest, average, etc.)
    }

    return Object.values(grouped).map(({ timestamp, value }) => ({
        timestamp: new Date(timestamp),
        echtwertInM: calcEchtwert(value),
        pnpInCm: value,
    }));
};

