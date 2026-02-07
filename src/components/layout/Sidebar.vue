<template>
  <nav id="sidebar" :class="{ active: sidebarActive }">
    <div class="sidebar-header">
      <h3>EngePro</h3>
    </div>
    <ul class="list-unstyled components">
      <li >
        <router-link to="/projetos" class="nav-link-custom" :class="{ active: $route.path === '/projetos' }">
          <i class="bi bi-kanban"></i>Projetos
        </router-link>
      </li>
      <li >
        <router-link to="/funis-etapas" class="nav-link-custom" :class="{ active: $route.path === '/funis-etapas' }">
          <i class="bi bi-diagram-3"></i>Funis e Etapas
        </router-link>
      </li>
      <li v-if="canShow">
        <router-link to="/usuarios" class="nav-link-custom" :class="{ active: $route.path === '/usuarios' }">
          <i class="bi bi-people"></i>Usuários
        </router-link>
      </li>
      <li v-if="canShow">
        <router-link to="/contatos" class="nav-link-custom" :class="{ active: $route.path === '/contatos' }">
          <i class="bi bi-people"></i>Contatos
        </router-link>
      </li>
      <li >
        <router-link to="/relatorios" class="nav-link-custom" :class="{ active: $route.path === '/relatorios' }">
          <i class="bi bi-file-earmark-bar-graph"></i>Relatórios
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import { ref, inject } from 'vue'
import { hasLevelConfig } from '@/services/auth'

export default {
  name: 'Sidebar',
  setup() {
    const sidebarActive = inject('sidebarActive', ref(false))

    // Converter para booleano
    const canShow = hasLevelConfig() === 'true'

    return {
      sidebarActive,
      canShow
    }
  }
}
</script>


<style scoped>
.nav-link-custom {
  color: white;
  text-decoration: none;
  display: block;
  padding: 15px 20px;
  transition: background-color 0.3s, border-left 0.3s;
  font-size: 0.95rem;
}

.nav-link-custom:hover {
  background-color: var(--accent-color);
  color: white;
}

.nav-link-custom.active {
  background-color: var(--accent-color);
  border-left: 5px solid white;
  font-weight: bold;
  color: white;
}

.nav-link-custom i {
  margin-right: 12px;
  font-size: 1.1rem;
}
</style>
