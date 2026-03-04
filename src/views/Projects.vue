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
                    title="Editar projeto"
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

    <div class="offcanvas offcanvas-end offcanvas-custom" tabindex="-1" id="offcanvasProjectForm"
      aria-labelledby="offcanvasProjectFormLabel" style="width: 500px;">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasProjectFormLabel">
          {{ editingProjectId ? 'Editar Projeto' : 'Novo Projeto' }}
        </h5>
        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <form @submit.prevent="saveProject">
          <div class="mb-3">
            <label class="form-label">Nome do Projeto</label>
            <input type="text" class="form-control" :class="{ 'is-invalid': projectErrors.name }" v-model="projectForm.name"
              @blur="validateProjectName" @input="validateProjectName">
            <div class="invalid-feedback" v-if="projectErrors.name">
              {{ projectErrors.name }}
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Contato</label>
            <select class="form-select" :class="{ 'is-invalid': projectErrors.contactId }" v-model="projectForm.contactId"
              @change="validateProjectContact">
              <option v-for="contact in contacts" :key="contact.id" :value="contact.id">
                {{ contact.name }}
              </option>
            </select>
            <div class="invalid-feedback" v-if="projectErrors.contactId">
              {{ projectErrors.contactId }}
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Responsável</label>
            <select class="form-select" v-model="projectForm.userId">
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label">Funil</label>
            <select class="form-select" :class="{ 'is-invalid': projectErrors.funnelId }" v-model="projectForm.funnelId"
              @change="updateStagesForForm(); validateProjectFunnel()">
              <option v-for="funnel in funnels" :key="funnel.id" :value="funnel.id">
                {{ funnel.name }}
              </option>
            </select>
            <div class="invalid-feedback" v-if="projectErrors.funnelId">
              {{ projectErrors.funnelId }}
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">{{ editingProjectId ? 'Etapa Atual' : 'Etapa Inicial' }}</label>
            <select class="form-select" :class="{ 'is-invalid': projectErrors.stepId }" v-model="projectForm.stepId"
              @change="validateProjectStep">
              <option v-for="step in formStages" :key="step.id" :value="step.id">
                {{ step.name }}
              </option>
            </select>
            <div class="invalid-feedback" v-if="projectErrors.stepId">
              {{ projectErrors.stepId }}
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Descrição</label>
            <textarea class="form-control" rows="3" v-model="projectForm.description"></textarea>
          </div>

          <div class="mb-3">
            <label class="form-label">Data de Início</label>
            <input type="date" class="form-control" :class="{ 'is-invalid': projectErrors.startDate }"
              v-model="projectForm.startDate" @change="validateProjectDates">
            <div class="invalid-feedback" v-if="projectErrors.startDate">
              {{ projectErrors.startDate }}
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Prazo Final</label>
            <input type="date" class="form-control" :class="{ 'is-invalid': projectErrors.endDate }"
              v-model="projectForm.endDate" @change="validateProjectDates">
            <div class="invalid-feedback" v-if="projectErrors.endDate">
              {{ projectErrors.endDate }}
            </div>
          </div>

          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-primary d-flex align-items-center" :disabled="isSavingProject">
              {{ isSavingProject ? 'Salvando...' : editingProjectId ? 'Salvar Alterações' : 'Salvar Projeto' }}
            </button>
            <button v-if="editingProjectId" type="button" class="btn"
              :class="projectForm.isArchived ? 'btn-success' : 'btn-warning'" @click="openArchiveModal(projectForm)">
              {{ projectForm.isArchived ? 'Desarquivar Projeto' : 'Arquivar Projeto' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="modal fade" id="confirmArchiveProjectModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ projectToArchive?.isArchived ? 'Confirmar Desarquivamento' : 'Confirmar Arquivamento' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <template v-if="projectToArchive?.isArchived">
              Tem certeza que deseja <strong>desarquivar</strong> o projeto
              <strong>{{ projectToArchive?.name }}</strong>?
            </template>
            <template v-else>
              Tem certeza que deseja <strong>arquivar</strong> o projeto
              <strong>{{ projectToArchive?.name }}</strong>?
            </template>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cancelar
            </button>
            <button type="button" class="btn" :class="projectToArchive?.isArchived ? 'btn-success' : 'btn-warning'"
              @click="confirmArchiveProject">
              {{ projectToArchive?.isArchived ? 'Desarquivar' : 'Arquivar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, reactive, ref } from 'vue'
import { Modal, Offcanvas } from 'bootstrap'
import ProjectService from '@/services/ProjectService'
import FunnelService from '@/services/FunnelService'
import UserService from '@/services/UserService'
import ContactService from '@/services/ContactService'

export default {
  name: 'Projects',
  setup() {
    const projects = ref([])
    const searchTerm = ref('')
    const isLoading = ref(false)
    const errorMessage = ref('')
    const users = ref([])
    const funnels = ref([])
    const contacts = ref([])
    const formStages = ref([])
    const editingProjectId = ref(null)
    const isSavingProject = ref(false)
    const projectToArchive = ref(null)
    const projectErrors = ref({})

    const projectForm = reactive({
      id: null,
      name: '',
      contactId: null,
      userId: null,
      funnelId: null,
      stepId: null,
      description: '',
      startDate: '',
      endDate: '',
      isArchived: false
    })

    const filteredProjects = computed(() => {
      const normalizedSearch = searchTerm.value.trim().toLowerCase()

      if (!normalizedSearch) {
        return projects.value
      }

      return projects.value.filter((project) => (project.name || '').toLowerCase().includes(normalizedSearch))
    })

    const normalizeListResponse = (response) => {
      if (Array.isArray(response)) return response
      if (Array.isArray(response?.content)) return response.content
      if (Array.isArray(response?.projects)) return response.projects
      if (Array.isArray(response?.data)) return response.data
      return []
    }

    const validateProjectName = () => {
      if (!projectForm.name || projectForm.name.trim() === '') {
        projectErrors.value.name = 'O nome do projeto é obrigatório.'
      } else {
        delete projectErrors.value.name
      }
    }

    const validateProjectContact = () => {
      if (!projectForm.contactId) {
        projectErrors.value.contactId = 'O contato é obrigatório.'
      } else {
        delete projectErrors.value.contactId
      }
    }

    const validateProjectFunnel = () => {
      if (!projectForm.funnelId) {
        projectErrors.value.funnelId = 'O funil é obrigatório.'
      } else {
        delete projectErrors.value.funnelId
      }
    }

    const validateProjectStep = () => {
      if (!projectForm.stepId) {
        projectErrors.value.stepId = 'A etapa é obrigatória.'
      } else {
        delete projectErrors.value.stepId
      }
    }

    const validateProjectDates = () => {
      delete projectErrors.value.startDate
      delete projectErrors.value.endDate

      if (!projectForm.startDate) {
        projectErrors.value.startDate = 'A data de início é obrigatória.'
      }

      if (!projectForm.endDate) {
        projectErrors.value.endDate = 'A data de fim é obrigatória.'
      }

      if (projectForm.startDate && projectForm.endDate && new Date(projectForm.startDate) > new Date(projectForm.endDate)) {
        projectErrors.value.endDate = 'O prazo final não pode ser anterior à data de início.'
      }
    }

    const validateProjectForm = () => {
      projectErrors.value = {}
      validateProjectName()
      validateProjectContact()
      validateProjectFunnel()
      validateProjectStep()
      validateProjectDates()
      return Object.keys(projectErrors.value).length === 0
    }

    const loadProjects = async () => {
      isLoading.value = true
      errorMessage.value = ''
      try {
        const response = await ProjectService.getAllProjects()
        projects.value = normalizeListResponse(response)
      } catch (error) {
        errorMessage.value = 'Não foi possível carregar os projetos. Tente novamente em instantes.'
      } finally {
        isLoading.value = false
      }
    }

    const updateStagesForForm = async () => {
      if (!projectForm.funnelId) {
        formStages.value = []
        projectForm.stepId = null
        return
      }

      try {
        const response = await FunnelService.getStepsByFunnelId(projectForm.funnelId)
        const dataSteps = Array.isArray(response?.steps)
          ? response.steps
          : Array.isArray(response)
            ? response
            : []
        formStages.value = dataSteps.map((step) => ({ id: step.id, name: step.name }))

        const hasCurrentStep = formStages.value.some((step) => step.id === projectForm.stepId)
        if (!hasCurrentStep) {
          projectForm.stepId = formStages.value[0]?.id || null
        }
      } catch (error) {
        formStages.value = []
        projectForm.stepId = null
      }
    }

    const loadAuxiliaryData = async () => {
      try {
        const [funnelResponse, usersResponse, contactsResponse] = await Promise.all([
          FunnelService.getAllFunnels(),
          UserService.getAllActive(),
          ContactService.getAllContacts()
        ])

        const fetchedFunnels = normalizeListResponse(funnelResponse).filter((funnel) => (funnel.steps || []).length > 0)
        funnels.value = fetchedFunnels
        users.value = normalizeListResponse(usersResponse)
        contacts.value = normalizeListResponse(contactsResponse)
      } catch (error) {
        console.error(error)
      }
    }

    const resetProjectForm = () => {
      Object.assign(projectForm, {
        id: null,
        name: '',
        contactId: contacts.value[0]?.id || null,
        userId: users.value[0]?.id || null,
        funnelId: funnels.value[0]?.id || null,
        stepId: null,
        description: '',
        startDate: '',
        endDate: '',
        isArchived: false
      })
      editingProjectId.value = null
      projectErrors.value = {}
      updateStagesForForm()
    }

    const openProjectOffcanvas = () => {
      const offcanvasElement = document.getElementById('offcanvasProjectForm')
      const offcanvasInstance = Offcanvas.getOrCreateInstance(offcanvasElement)
      offcanvasInstance.show()
    }

    const closeProjectOffcanvas = () => {
      const offcanvasElement = document.getElementById('offcanvasProjectForm')
      const offcanvasInstance = Offcanvas.getInstance(offcanvasElement)
      if (offcanvasInstance) {
        offcanvasInstance.hide()
      }
    }

    const fillProjectForm = async (project) => {
      Object.assign(projectForm, {
        id: project.id,
        name: project.name || '',
        contactId: project.contactId || contacts.value[0]?.id || null,
        userId: project.userId || users.value[0]?.id || null,
        funnelId: project.funnelId || funnels.value[0]?.id || null,
        stepId: project.stepId || null,
        description: project.description || '',
        startDate: project.startDate ? project.startDate.substring(0, 10) : '',
        endDate: project.endDate ? project.endDate.substring(0, 10) : '',
        isArchived: !!project.isArchived
      })
      await updateStagesForForm()
    }

    const openQuickEdit = async (project) => {
      resetProjectForm()
      editingProjectId.value = project.id
      await fillProjectForm(project)
      openProjectOffcanvas()
    }

    const openNewProject = () => {
      resetProjectForm()
      openProjectOffcanvas()
    }

    const saveProject = async () => {
      if (!validateProjectForm()) {
        return
      }

      isSavingProject.value = true
      try {
        if (editingProjectId.value) {
          await ProjectService.updateProject(editingProjectId.value, projectForm)
        } else {
          await ProjectService.createProject(projectForm)
        }

        await loadProjects()
        closeProjectOffcanvas()
        resetProjectForm()
      } catch (error) {
        console.error(error)
      } finally {
        isSavingProject.value = false
      }
    }

    const openArchiveModal = (project) => {
      projectToArchive.value = project
      const modalEl = document.getElementById('confirmArchiveProjectModal')
      const modal = new Modal(modalEl)
      modal.show()
    }

    const confirmArchiveProject = async () => {
      if (!projectToArchive.value) return

      try {
        await ProjectService.archiveProject(projectToArchive.value.id)
        await loadProjects()
        const modalEl = document.getElementById('confirmArchiveProjectModal')
        const modal = Modal.getInstance(modalEl)
        modal.hide()
        closeProjectOffcanvas()
        resetProjectForm()
      } catch (error) {
        console.error('Erro ao (des)arquivar projeto:', error)
      }
    }

    onMounted(async () => {
      await Promise.all([loadProjects(), loadAuxiliaryData()])
      resetProjectForm()
    })

    return {
      confirmArchiveProject,
      contacts,
      editingProjectId,
      errorMessage,
      filteredProjects,
      formStages,
      funnels,
      isLoading,
      isSavingProject,
      openArchiveModal,
      openNewProject,
      openQuickEdit,
      projectErrors,
      projectForm,
      projectToArchive,
      saveProject,
      searchTerm,
      updateStagesForForm,
      users,
      validateProjectContact,
      validateProjectDates,
      validateProjectFunnel,
      validateProjectName,
      validateProjectStep
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
