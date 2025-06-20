<script setup>
import AirDatepicker from "air-datepicker";
import localeDe from 'air-datepicker/locale/de'
import "air-datepicker/air-datepicker.css"
import {onMounted, ref, watch} from "vue";
import {store} from "@/store.js";
import {TimeWindow} from "@/services/sondenService.js";

const inputRef = ref(null)
let dp;
let selectTimeout;

onMounted(() => {
  dp = new AirDatepicker(inputRef.value, {
    range: true,
    multipleDatesSeparator: ' - ',
    locale: localeDe,
    inline: true,
    minDate: new Date(2020, 0, 1),
    maxDate: new Date(),
    date: [store.startDate, store.endDate],
    onSelect({ date }) {
      if (selectTimeout) clearTimeout(selectTimeout);
      selectTimeout = setTimeout(() => {
        if (date && date.length === 2) {
          if (
              store.startDate.getTime() !== date[0].getTime() ||
              store.endDate.getTime() !== date[1].getTime()
          ) {
            store.startDate = date[0];
            store.endDate = date[1];
          }
        }
      }, 100); // 100 ms warten, kann auch angepasst werden
    },
    buttons: [
      {
        content: '1 Woche',
        className: 'btn-1w',
        onClick: (dp) => {
          const today = new Date();
          const oneWeekAgo = new Date(today);
          oneWeekAgo.setDate(today.getDate() - 7);
          dp.selectDate([oneWeekAgo, today]);
        }
      },
      {
        content: '1 Monat',
        className: 'btn-1m',
        onClick: (dp) => {
          const today = new Date();
          const oneMonthAgo = new Date(today);
          oneMonthAgo.setMonth(today.getMonth() - 1);
          dp.selectDate([oneMonthAgo, today]);
        }
      },
      {
        content: '1 Jahr',
        className: 'btn-1y',
        onClick: (dp) => {
          const today = new Date();
          const oneYearAgo = new Date(today);
          oneYearAgo.setFullYear(today.getFullYear() - 1);
          dp.selectDate([oneYearAgo, today]);
        }
      },
      {
        content: '2 Jahre',
        className: 'btn-2y',
        onClick: (dp) => {
          const today = new Date();
          const twoYearsAgo = new Date(today);
          twoYearsAgo.setFullYear(today.getFullYear() - 2);
          dp.selectDate([twoYearsAgo, today]);
        }
      },
      {
        content: '5 Jahre',
        className: 'btn-5y',
        onClick: (dp) => {
          const today = new Date();
          const fiveYearsAgo = new Date(today);
          fiveYearsAgo.setFullYear(today.getFullYear() - 5);
          dp.selectDate([fiveYearsAgo, today]);
        }
      }
    ]
  })
})

watch(() => [store.startDate, store.endDate], ([start, end]) => {
  if (dp) {
    dp.selectDate([new Date(start), new Date(end)], true);
  }
});
</script>

<template>
  Intervall wählen:
  <select v-model="store.interval">
    <option :value="TimeWindow.HOUR">Stunden</option>
    <option :value="TimeWindow.DAY">Tage</option>
    <option :value="TimeWindow.WEEK">Wochen</option>
    <option :value="TimeWindow.MONTH">Monate</option>
  </select>
  Zeitraum auswählen:
  <input ref="inputRef" type="text" />
</template>

<style scoped>
.air-datepicker-buttons {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 6px;
}

.air-datepicker-button {
  width: 100%;
  text-align: left;
}
</style>
