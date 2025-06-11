<script setup>
import Map from "@/components/Map.vue";
</script>

<template>
  <main>
    <h1>THB Wasserkarte Prototyp</h1>
    <Map/>
  </main>
</template>

<style scoped>
main {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
Map {
  flex-grow: 0;
}
</style>
