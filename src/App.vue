<script setup>
import '@coreui/coreui/dist/css/coreui.min.css'
import { CHeader } from "@coreui/vue";
import {CHeaderBrand} from "@coreui/vue/dist/esm/components/header/index.js";
import {CFooter} from "@coreui/vue/dist/esm/components/footer/index.js";
import PageBody from "@/components/PageBody.vue";
</script>

<template>
  <main>
    <CHeader>
      <CHeaderBrand href="#">THB Wasserkarte Prototyp</CHeaderBrand>
    </CHeader>
    <PageBody/>
    <CFooter>
      <div>
        <a href="https://github.com/Doubrixel/thb-water-map-prototype">Quellcode</a>
      </div>
      <div>
        Favicon powered by
        <a href="https://www.freepik.com/icon/water-drop_12041742">Freepik</a>
      </div>
    </CFooter>
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
.footer {
  width: 100%;
}
.header {
  width: 100%;
}
</style>
