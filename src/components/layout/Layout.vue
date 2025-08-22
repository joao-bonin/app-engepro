<template>
  <div class="wrapper">
    <!-- Sidebar -->
    <Sidebar />
    
    <!-- Page Content -->
    <div id="content" :class="{ active: sidebarActive }">
      <!-- Top Navbar -->
      <Topbar />
      
      <!-- Main Content Area -->
      <div class="container-fluid py-4">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, provide } from 'vue'
import Sidebar from './Sidebar.vue'
import Topbar from './Topbar.vue'

export default {
  name: 'Layout',
  components: {
    Sidebar,
    Topbar
  },
  setup() {
    const sidebarActive = ref(false)
    
    // Fornecer o estado do sidebar para componentes filhos
    provide('sidebarActive', sidebarActive)
    
    return {
      sidebarActive
    }
  }
}
</script>

<style scoped>
.wrapper {
  display: flex;
  width: 100%;
  align-items: stretch;
}

#content {
  width: calc(100% - var(--sidebar-width));
  margin-left: var(--sidebar-width);
  transition: all 0.3s;
  min-height: 100vh;
  padding-top: var(--topbar-height);
}

@media (max-width: 768px) {
  #content {
    width: 100%;
    margin-left: 0;
  }
  
  #content.active {
    margin-left: var(--sidebar-width);
  }
}
</style>

