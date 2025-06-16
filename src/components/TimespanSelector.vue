<script setup>
import AirDatepicker from "air-datepicker";
import localeDe from 'air-datepicker/locale/de'
import "air-datepicker/air-datepicker.css"
import {onMounted, ref, watch} from "vue";
import {store} from "@/store.js";

const inputRef = ref(null)
let dp;

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
      if (date && date.length === 2) {
        store.startDate = date[0]
        store.endDate = date[1]
      }
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
    <option>Stunden</option>
    <option>Tage</option>
    <option>Wochen</option>
    <option>Monate</option>
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
