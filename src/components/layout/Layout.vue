<template>
  <div class="app-layout">
    <Topbar />
    <Sidebar />
    <main class="app-main container-fluid">
      <router-view />
    </main>
  </div>
</template>

<script>
import Topbar from './Topbar.vue'
import Sidebar from './Sidebar.vue'

export default {
  components: { Topbar, Sidebar }
}
</script>

<!-- Estilos ficam no main.css; se usar scoped aqui, não duplique as classes -->
