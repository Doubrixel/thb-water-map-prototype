const PrivateInterval = {}
PrivateInterval.SECOND = 1000
PrivateInterval.MINUTE = 60 * PrivateInterval.SECOND
PrivateInterval.HOUR = 60 * PrivateInterval.MINUTE


export const Interval = {}
Interval.DAY = 24 * PrivateInterval.HOUR
Interval.WEEK = 7 * Interval.DAY
Interval.MONTH = 30 * Interval.DAY
Interval.YEAR = 365 * Interval.DAY

export const TimeWindow = {}
TimeWindow.DAY = Interval.DAY / PrivateInterval.MINUTE
TimeWindow.WEEK = Interval.WEEK / PrivateInterval.MINUTE

export const fetchDataForPastInterval = async (sonde, interval) => {
    const now = new Date()
    const beginDate = new Date(now.getTime() - interval)
    return await fetchDataForDateRange(sonde, beginDate, now)
}

export const fetchDataForDateRangeWithTimeWindow = async (sonde, beginDate, endDate, timeWindow) => {
    const url = buildUrl(sonde, beginDate, endDate, timeWindow)
    const response = await fetch(url)
    const rawData = await response.json()
    return processData(rawData, sonde)
}

export const fetchDataForDateRange = async (sonde, beginDate, endDate) => {
    return await fetchDataForDateRangeWithTimeWindow(sonde, beginDate, endDate, TimeWindow.DAY)
}

export const fetchDataSince = async (sonde, beginDate) => {
    return await fetchDataForDateRange(sonde, beginDate, new Date())
}

export const fetchDataSinceWithTimeWindow = async (sonde, beginDate, timeWindow) => {
    return await fetchDataForDateRangeWithTimeWindow(sonde, beginDate, new Date(), timeWindow)
}

const buildUrl = (sonde, beginDate, endDate, timeWindow) => {
    const { sensorId } = sonde
    const prefix = 'https://map.ttn-brb.de'
    const baseUrl = prefix + `/api/v0/sensors/${sensorId}/series/water_level/data`
    const urlParams = {
        start: dateToApiFormat(beginDate),
        end: dateToApiFormat(endDate),
        window: timeWindow
    }
    const queryString = new URLSearchParams(urlParams).toString()
    return `${baseUrl}?${queryString}`
}

const dateToApiFormat = (date) => {
    return date.toISOString().slice(0, 16) + 'Z'
}

const processData = (rawData, sonde) => {
    const { samples } = rawData
    const { echtwert, pnp } = sonde //echtwert in m, pnp in mm
    const calcEchtwert = (valueInMm) => valueInMm != null ? (echtwert - valueInMm / 1000.0).toFixed(2) : null
    const calcPnp = (valueInMm) => valueInMm != null ? ((pnp - valueInMm)/10).toFixed(0) : null
    return samples.map(({ts, value}) => ({timestamp: new Date(ts), echtwertInM: calcEchtwert(value), pnpInCm: calcPnp(value)}))
}

