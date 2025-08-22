<template>
  <div id="app">
    <Layout />
  </div>
</template>

<script>
import Layout from './components/layout/Layout.vue'

export default {
  name: 'App',
  components: {
    Layout
  }
}
</script>

<style>
/* Importar Bootstrap CSS */
@import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css');
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css');

/* Importar estilos customizados */
@import './assets/css/main.css';
@import './assets/css/sidebar.css';
@import './assets/css/kanban.css';

#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Reset de estilos */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}

/* Utilitários globais */
.page-content {
  padding: 0;
}

.d-none {
  display: none !important;
}

/* Animações */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>

