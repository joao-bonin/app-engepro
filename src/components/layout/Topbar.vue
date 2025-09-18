<template>
  <nav class="navbar navbar-expand-lg navbar-custom">
    <div class="container-fluid">
      <button type="button" id="sidebarCollapse" class="btn btn-sm btn-primary-custom d-md-none" @click="toggleSidebar">
        <i class="bi bi-list"></i>
      </button>

      <div class="ms-auto d-flex align-items-center">
        <div class="dropdown">
          <a href="#" class="d-flex align-items-center text-dark text-decoration-none" @click.prevent="toggleDropdown">
            <div class="user-avatar me-2">
              <span v-if="!currentUser.avatar">{{ initials }}</span>
              <img v-else :src="currentUser.avatar" alt="User" class="user-avatar">
            </div>
            <span>{{ currentUser.name }}</span>
            <i class="bi bi-caret-down ms-2"></i>
          </a>

          <!-- Dropdown controlado pelo Vue -->
          <ul v-if="dropdownOpen" class="dropdown-menu dropdown-menu-end show">
            <li>
              <a class="dropdown-item" href="#" @click="viewProfile">
                <i class="bi bi-person me-2"></i>Perfil
              </a>
            </li>
            <li>
              <hr class="dropdown-divider">
            </li>
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
import { ref, inject, onMounted, onBeforeUnmount, computed } from 'vue'
import { doLogout } from '@/services/auth'

export default {
  name: 'Topbar',
  setup() {
    const sidebarActive = inject('sidebarActive', ref(false))
    const dropdownOpen = ref(false)

    const initials = computed(() => {
      if (!currentUser.value.name) return "U"
      return currentUser.value.name
        .split(" ")
        .map(n => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    })

    const currentUser = ref({
      name: localStorage.getItem('userName') || 'Usuário',
      email: localStorage.getItem('userEmail') || 'usuario@engepro.com',
      avatar: localStorage.getItem('userAvatar') || null
    })

    const toggleSidebar = () => {
      sidebarActive.value = !sidebarActive.value
    }

    const toggleDropdown = () => {
      dropdownOpen.value = !dropdownOpen.value
    }

    const closeDropdown = () => {
      dropdownOpen.value = false
    }

    const viewProfile = () => {
      console.log('Ver perfil')
    }

    const logout = async () => {
      doLogout()
    }

    // fecha dropdown se clicar fora
    const handleClickOutside = (event) => {
      const dropdownEl = document.querySelector('.dropdown')
      if (dropdownEl && !dropdownEl.contains(event.target)) {
        dropdownOpen.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      currentUser,
      sidebarActive,
      dropdownOpen,
      toggleSidebar,
      toggleDropdown,
      closeDropdown,
      viewProfile,
      logout,
      initials
    }
  }
}
</script>



<style scoped>
/* Força tamanho fixo do dropdown */
.dropdown-menu {
  min-width: 180px;
  /* largura mínima */
  max-width: 220px;
  /* largura máxima opcional */
  padding: 0.5rem 0;
  border-radius: 0.5rem;
}

/* Itens do dropdown */
.dropdown-item {
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
}

/* Avatar fixo */
.user-avatar {
  width: 32px;
  height: 32px;
  object-fit: cover;
  border-radius: 50%;
  background-color: #34495e;
  /* cor padrão */
  color: #fff;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
