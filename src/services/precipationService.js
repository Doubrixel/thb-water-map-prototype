//vibe code
export const fetchData = async (startDate, endDate, intervalMinutes) => {
    const dateToApiFormat = (date) => {
        return date.toISOString().slice(0, 10)
    };

    const params = {
        latitude: 52.4167,
        longitude: 12.55,
        start_date: dateToApiFormat(startDate),
        end_date: dateToApiFormat(endDate),
        hourly: "precipitation"
    };

    const queryString = new URLSearchParams(params).toString()
    const url = `https://archive-api.open-meteo.com/v1/archive?${queryString}`

    const response = await fetch(url)
    const data = await response.json()

    const times = data.hourly.time // array of ISO strings
    const values = data.hourly.precipitation // array of floats

    // Convert interval in minutes to number of steps to skip
    const stepSize = Math.max(Math.floor(intervalMinutes / 60), 1) // at least 1 to avoid empty results

    const result = [];
    for (let i = 0; i < times.length; i += stepSize) {
        const groupTimestamps = times.slice(i, i + stepSize);
        const groupValues = values.slice(i, i + stepSize);
        const timestamp = new Date(groupTimestamps[0]); // or average/center if you prefer

        const value = groupValues.reduce((sum, v) => sum + v, 0); // mm over the period

        result.push({ timestamp, value });
    }

    return result
}
