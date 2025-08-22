<template>
  <nav class="navbar navbar-expand-lg navbar-custom">
    <div class="container-fluid">
      <button 
        type="button" 
        id="sidebarCollapse" 
        class="btn btn-sm btn-primary-custom d-md-none"
        @click="toggleSidebar"
      >
        <i class="bi bi-list"></i>
      </button>
      
      <div class="ms-auto d-flex align-items-center">
        <div class="dropdown">
          <a 
            href="#" 
            class="d-flex align-items-center text-dark text-decoration-none dropdown-toggle" 
            id="userDropdown" 
            data-bs-toggle="dropdown" 
            aria-expanded="false"
          >
            <img 
              src="https://placehold.co/32x32/34495e/FFFFFF?text=JB" 
              alt="User" 
              width="32" 
              height="32" 
              class="rounded-circle me-2"
            >
            <span>{{ currentUser.name }}</span>
          </a>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
            <li>
              <a class="dropdown-item" href="#" @click="viewProfile">
                <i class="bi bi-person me-2"></i>Perfil
              </a>
            </li>
            <li><hr class="dropdown-divider"></li>
            <li>
              <a class="dropdown-item" href="#" @click="logout">
                <i class="bi bi-box-arrow-right me-2"></i>Sair
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, inject } from 'vue'

export default {
  name: 'Topbar',
  setup() {
    // Usar provide/inject para compartilhar estado do sidebar
    const sidebarActive = inject('sidebarActive', ref(false))
    
    const currentUser = ref({
      name: 'João Bonin',
      email: 'joao.bonin@engepro.com'
    })
    
    const toggleSidebar = () => {
      sidebarActive.value = !sidebarActive.value
    }
    
    const viewProfile = () => {
      // Implementar visualização de perfil
      console.log('Ver perfil')
    }
    
    const logout = () => {
      // Implementar logout
      console.log('Logout')
    }
    
    return {
      currentUser,
      toggleSidebar,
      viewProfile,
      logout
    }
  }
}
</script>

<style scoped>
.navbar-custom {
  background-color: white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  height: var(--topbar-height);
  position: fixed;
  top: 0;
  left: var(--sidebar-width);
  right: 0;
  z-index: 1020;
  transition: left 0.3s;
}

@media (max-width: 768px) {
  .navbar-custom {
    left: 0;
  }
}
</style>

