import { reactive } from 'vue'
import {TimeWindow} from "@/services/sondenService.js";

export const MAP = 'map'
export const OVERVIEW = 'overview'
export const COMPARISON = 'comparison'

export const store = reactive({
    selectedTab: MAP,
    selectMap() {
        this.selectedTab = MAP
    },
    selectOverview() {
        this.selectedTab = OVERVIEW
    },
    selectComparison() {
        this.selectedTab = COMPARISON
    },
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date(),
    interval: TimeWindow.DAY,
    selectedDataRows: []
})
