<template>
  <div class="projects-page">
    <div class="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
      <h2 class="page-title mb-0">Listagem de Projetos</h2>
      <div class="d-flex flex-wrap align-items-end gap-2 w-100 w-md-auto justify-content-md-end">
        <div class="search-wrapper">
          <label class="form-label fw-semibold mb-1">Buscar projeto</label>
          <i class="bi bi-search"></i>
          <input
            v-model="searchTerm"
            type="text"
            class="form-control"
            placeholder="Buscar por nome do projeto"
          >
        </div>
        <button
          class="btn btn-primary d-flex align-items-center action-new-project"
          type="button"
          @click="openNewProject"
        >
          <i class="bi bi-plus-circle me-2"></i>Novo Projeto
        </button>
      </div>
    </div>

    <div class="card-custom">
      <div class="card-body p-0">
        <div v-if="isLoading" class="text-center py-4 text-muted">Carregando projetos...</div>

        <div v-else-if="errorMessage" class="alert alert-danger m-3 mb-0">
          {{ errorMessage }}
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th scope="col">Projeto</th>
                <th scope="col">Funil</th>
                <th scope="col">Etapa</th>
                <th scope="col">Responsável</th>
                <th scope="col">Status</th>
                <th scope="col" class="text-end">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="project in filteredProjects" :key="project.id">
                <td>{{ project.name || 'Sem nome' }}</td>
                <td>{{ project.funnelName || '-' }}</td>
                <td>{{ project.stepName || '-' }}</td>
                <td>{{ project.userName || '-' }}</td>
                <td>
                  <span class="badge" :class="project.isArchived ? 'bg-secondary' : 'bg-success'">
                    {{ project.isArchived ? 'Arquivado' : 'Ativo' }}
                  </span>
                </td>
                <td class="text-end">
                  <button
                    class="btn btn-sm btn-warning"
                    type="button"
                    title="Editar no Kanban"
                    @click="openQuickEdit(project)"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                </td>
              </tr>

              <tr v-if="filteredProjects.length === 0">
                <td colspan="6" class="text-center text-muted py-4">
                  Nenhum projeto encontrado para o filtro informado.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ProjectService from '@/services/ProjectService'

export default {
  name: 'Projects',
  setup() {
    const router = useRouter()
    const projects = ref([])
    const searchTerm = ref('')
    const isLoading = ref(false)
    const errorMessage = ref('')

    const filteredProjects = computed(() => {
      const normalizedSearch = searchTerm.value.trim().toLowerCase()

      if (!normalizedSearch) {
        return projects.value
      }

      return projects.value.filter((project) => (project.name || '').toLowerCase().includes(normalizedSearch))
    })

    const normalizeProjectsResponse = (response) => {
      if (Array.isArray(response)) {
        return response
      }

      if (Array.isArray(response?.content)) {
        return response.content
      }

      if (Array.isArray(response?.projects)) {
        return response.projects
      }

      if (Array.isArray(response?.data)) {
        return response.data
      }

      return []
    }

    const loadProjects = async () => {
      isLoading.value = true
      errorMessage.value = ''

      try {
        const response = await ProjectService.getAllProjects()
        projects.value = normalizeProjectsResponse(response)
      } catch (error) {
        errorMessage.value = 'Não foi possível carregar os projetos. Tente novamente em instantes.'
        console.error(error)
      } finally {
        isLoading.value = false
      }
    }

    const openQuickEdit = (project) => {
      router.push({
        name: 'Projetos',
        query: {
          editProjectId: project.id
        }
      })
    }

    const openNewProject = () => {
      router.push({
        name: 'Projetos',
        query: {
          openNewProject: '1'
        }
      })
    }

    onMounted(() => {
      loadProjects()
    })

    return {
      errorMessage,
      filteredProjects,
      isLoading,
      openNewProject,
      openQuickEdit,
      searchTerm
    }
  }
}
</script>

<style scoped>
.search-wrapper {
  position: relative;
  width: min(100%, 320px);
}

.action-new-project {
  height: fit-content;
  margin-bottom: 0.1rem;
}

.search-wrapper .bi-search {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}

.search-wrapper .form-control {
  padding-left: 2.25rem;
}
</style>
