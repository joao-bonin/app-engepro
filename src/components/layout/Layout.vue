<!-- src/components/layout/Layout.vue -->
<script setup>
// IMPORTES QUE VALEM SÓ QUANDO O LAYOUT É USADO:
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import Sidebar from './Sidebar.vue'
import Topbar from './Topbar.vue'
</script>

<template>
  <div class="layout d-flex">
    <Sidebar />
    <div class="flex-grow-1">
      <Topbar />
      <div class="p-3">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* estilos específicos do seu layout... */
</style>
