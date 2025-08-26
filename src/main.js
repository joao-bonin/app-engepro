// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 1) Frameworks/CSS base (antes)
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js' // <- importante usar o bundle (JS + Popper)
import 'bootstrap-icons/font/bootstrap-icons.css'


// 2) Seus estilos globais (depois, para sobrescrever)
import './assets/css/main.css'
import './assets/css/sidebar.css'
import './assets/css/kanban.css'

createApp(App).use(router).mount('#app')
