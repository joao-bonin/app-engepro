<template>

  <div class="projetos-page">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="page-title mb-0">Projetos</h2>
      <div v-if="hasLevelConfig">
        <button v-if="funnels.length !== 0" class="btn btn-primary d-flex align-items-center" type="button"
          data-bs-toggle="offcanvas" data-bs-target="#offcanvasNovoProjeto" aria-controls="offcanvasNovoProjeto"
          @click="resetFormAndOpenOffcanvas">
          <i class="bi bi-plus-circle me-2"></i>Novo Projeto
        </button>
      </div>
    </div>

    <!-- Seletor de Funil + Filtro de Projetos Arquivados -->
    <div v-if="funnels.length !== 0" class="row mb-3">
      <!-- Selecionar Funil -->
      <div class="col-md-3">
        <label for="selectFunilKanban" class="form-label"><strong>Selecionar Funil:</strong></label>
        <select class="form-select" id="selectFunilKanban" v-model="selectedFunilId" @change="loadProjetosByFunil">
          <option v-for="funil in funnels" :key="funil.id" :value="funil.id">
            {{ funil.name }}
          </option>
        </select>
      </div>

      <!-- Exibir Projetos (Filtro de Arquivamento) -->
      <div class="col-md-3">
        <label for="selectArchivedFilter" class="form-label"><strong>Exibir:</strong></label>
        <select class="form-select" id="selectArchivedFilter" v-model="archivedFilter" @change="loadProjetosByFunil">
          <option value="active">Projetos Ativos</option>
          <option value="archived">Projetos Arquivados</option>
          <option value="all">Todos os Projetos</option>
        </select>
      </div>
    </div>


    <div v-if="funnels.length === 0" class="alert alert-info">
      Adicione um funil com etapas para começar a gerenciar seus projetos!
    </div>


    <!-- Kanban Board -->
    <KanbanBoard :columns="kanbanColumns" :projects="projects" :has-level-config="hasLevelConfig" @move-project="moveProject"
      @edit-project="editProject" />

    <!-- Offcanvas Novo/Editar Projeto -->
    <div class="offcanvas offcanvas-end offcanvas-custom" tabindex="-1" id="offcanvasNovoProjeto"
      aria-labelledby="offcanvasNovoProjetoLabel" style="width: 500px;">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasNovoProjetoLabel">
          {{ editingProject ? 'Editar Projeto' : 'Novo Projeto' }}
        </h5>
        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <form @submit.prevent="saveProject">
          <!-- Nome do Projeto -->
          <div class="mb-3">
            <label class="form-label">Nome do Projeto</label>
            <input type="text" class="form-control" :class="{ 'is-invalid': projectErrors.name }"
              v-model="projectForm.name" @blur="validateProjectName" @input="validateProjectName">
            <div class="invalid-feedback" v-if="projectErrors.name">
              {{ projectErrors.name }}
            </div>
          </div>
          <!-- Contato -->
          <div class="mb-3">
            <label class="form-label">Contato</label>
            <select class="form-select" v-model="projectForm.contactId">
              <option v-for="contact in contacts" :key="contact.id" :value="contact.id">
                {{ contact.name }}
              </option>
            </select>
          </div>
          <!-- Responsavel -->
          <div class="mb-3">
            <label class="form-label">Responsável</label>
            <select class="form-select" v-model="projectForm.userId">
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
          </div>
          <!-- Funil - Sempre visível -->
          <div class="mb-3">
            <label class="form-label">Funil</label>
            <select class="form-select" :class="{ 'is-invalid': projectErrors.funnelId }" v-model="projectForm.funnelId"
              @change="updateStagesForForm(); validateProjectFunnel()">
              <option v-for="funil in funnels" :key="funil.id" :value="funil.id">
                {{ funil.name }}
              </option>
            </select>
            <div class="invalid-feedback" v-if="projectErrors.funnelId">
              {{ projectErrors.funnelId }}
            </div>
          </div>
          <!-- Etapa Inicial -->
          <div class="mb-3">
            <label class="form-label">{{ editingProject ? 'Etapa Atual' : 'Etapa Inicial' }}</label>
            <select class="form-select" :class="{ 'is-invalid': projectErrors.stepId }" v-model="projectForm.stepId"
              @change="validateProjectStep">
              <option v-for="stage in formStages" :key="stage.id" :value="stage.id">
                {{ stage.name }}
              </option>
            </select>
            <div class="invalid-feedback" v-if="projectErrors.stepId">
              {{ projectErrors.stepId }}
            </div>
          </div>
          <!-- Descrição -->
          <div class="mb-3">
            <label class="form-label">Descrição</label>
            <textarea class="form-control" rows="3" v-model="projectForm.description"></textarea>
          </div>
          <!-- Data de Início -->
          <div class="mb-3">
            <label class="form-label">Data de Início</label>
            <input type="date" class="form-control" :class="{ 'is-invalid': projectErrors.startDate }"
              v-model="projectForm.startDate" @change="validateProjectDates">
            <div class="invalid-feedback" v-if="projectErrors.startDate">
              {{ projectErrors.startDate }}
            </div>
          </div>
          <!-- Prazo Final -->
          <div class="mb-3">
            <label class="form-label">Prazo Final</label>
            <input type="date" class="form-control" :class="{ 'is-invalid': projectErrors.endDate }"
              v-model="projectForm.endDate" @change="validateProjectDates">
            <div class="invalid-feedback" v-if="projectErrors.endDate">
              {{ projectErrors.endDate }}
            </div>
          </div>
          <!-- Usuário (Mockado, pois o backend exige) -->
          <input type="hidden" v-model="projectForm.userId">

          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-primary d-flex align-items-center">
              {{ editingProject ? 'Salvar Alterações' : 'Salvar Projeto' }}
            </button>
            <!-- Botão de Arquivar/Desarquivar -->
            <button v-if="editingProject" type="button" class="btn"
              :class="projectForm.isArchived ? 'btn-success' : 'btn-warning'" @click="openArchiveModal(projectForm)">
              {{ projectForm.isArchived ? 'Desarquivar Projeto' : 'Arquivar Projeto' }}
            </button>

            <!-- O backend não tem rota de exclusão, apenas arquivamento -->
          </div>
        </form>
      </div>
    </div>
    <!-- Modal de Confirmação de Arquivamento/Desarquivamento -->
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
              <br />
              <br />
              Ele voltará a aparecer no Kanban.
            </template>
            <template v-else>
              Tem certeza que deseja <strong>arquivar</strong> o projeto
              <strong>{{ projectToArchive?.name }}</strong>?
              <br />
              <br />
              Ele será removido da visualização do Kanban, mas poderá ser acessado através do filtro “Projetos
              Arquivados”.
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
import { ref, reactive, onMounted } from 'vue'
import KanbanBoard from '../components/kanban/KanbanBoard.vue'
import ProjectService from '../services/ProjectService'
import FunnelService from '../services/FunnelService'
import UserService from '../services/UserService'
import ContactService from '../services/ContactService'
import { Modal, Offcanvas } from 'bootstrap'


export default {
  name: 'Projetos',
  components: {
    KanbanBoard
  },
  setup() {
    // Dados do Kanban
    const selectedFunilId = ref(null)
    const archivedFilter = ref('active') // 'active', 'archived', 'all'
    const funnels = ref([])
    const users = ref([])
    const kanbanColumns = ref([])
    const projects = ref([])
    const contacts = ref([])

    const hasLevelConfig = ref(localStorage.getItem("hasLevelConfig") === "true")

    // Dados do Formulário
    const editingProject = ref(null)
    const projectErrors = ref({})
    const formStages = ref([])
    const projectForm = reactive({
      id: null,
      name: '',
      contactId: null,
      funnelId: null,
      stepId: null,
      description: '',
      startDate: '',
      endDate: '',
      userId: 1,
      isArchived: false
    })

    const validateProjectName = () => {
      if (!projectForm.name || projectForm.name.trim() === "") {
        projectErrors.value.name = "O nome do projeto é obrigatório."
      } else {
        delete projectErrors.value.name
      }
    }

    const validateProjectContact = () => {
      if (!projectForm.contactId) {
        projectErrors.value.contactId = "O contato é obrigatório."
      } else {
        delete projectErrors.value.customer
      }
    }

    const validateProjectFunnel = () => {
      if (!projectForm.funnelId) {
        projectErrors.value.funnelId = "O funil é obrigatório."
      } else {
        delete projectErrors.value.funnelId
      }
    }

    const validateProjectStep = () => {
      if (!projectForm.stepId) {
        projectErrors.value.stepId = "A etapa é obrigatória."
      } else {
        delete projectErrors.value.stepId
      }
    }

    const validateProjectDates = () => {
      delete projectErrors.value.startDate
      delete projectErrors.value.endDate

      if (projectForm.startDate === "") {
        projectErrors.value.startDate = "A data de início é obrigatória."
      }

      if (projectForm.endDate === "") {
        projectErrors.value.endDate = "A data de fim é obrigatória."
      }

      if (projectForm.startDate && projectForm.endDate) {
        const start = new Date(projectForm.startDate)
        const end = new Date(projectForm.endDate)
        if (start > end) {
          projectErrors.value.endDate = "O prazo final não pode ser anterior à data de início."
        }
      }
    }

    const validateProjectForm = () => {
      projectErrors.value = {} // Limpa todos os erros antes de validar

      validateProjectName()
      validateProjectContact()
      validateProjectFunnel()
      validateProjectStep()
      validateProjectDates()

      return Object.keys(projectErrors.value).length === 0
    }

    const loadFunnels = async () => {
      try {
        const data = await FunnelService.getAllFunnels()
        const funnelFiltered = data.filter(funnel => funnel.steps.length > 0)
        funnels.value = funnelFiltered
        if (funnelFiltered.length > 0) {
          selectedFunilId.value = funnelFiltered[0].id
          await loadProjetosByFunil()
        } else {
          funnels.value = []
        }
      } catch (error) {
        console.error('Erro ao carregar funis:', error)
      }
    }

    const loadActiveUsers = async () => {
      try {
        const data = await UserService.getAllActive()
        users.value = data
        if (data.length > 0) {
          projectForm.userId = data[0].id
        }
      } catch (error) {
        console.error('Erro ao carregar os responsáveis:', error)
      }
    }

    const loadContacts = async () => {
      try {
        const data = await ContactService.getAllContacts()
        contacts.value = data
        if (data.length > 0) {
          projectForm.contactId = data[0].id
        }
      } catch (error) {
        console.error('Erro ao carregar os contatos:', error)
      }
    }

    const loadProjetosByFunil = async () => {
      if (!selectedFunilId.value) return

      try {
        let urlParam = ''
        if (archivedFilter.value === 'active') {
          urlParam = '?archived=false'
        } else if (archivedFilter.value === 'archived') {
          urlParam = '?archived=true'
        }

        // 🔗 Chamada à API conforme o filtro selecionado
        const data = await ProjectService.getProjectsByFunnelId(selectedFunilId.value, urlParam)

        kanbanColumns.value = data.steps.map(step => ({
          id: step.id,
          title: step.name,
          count: step.projects.length
        }))

        projects.value = data.steps.flatMap(step =>
          step.projects.map(p => ({
            ...p,
            stage: p.stepId,
            deadline: p.endDate
              ? new Date(p.endDate).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
              })
              : 'N/A'
          }))
        )

        updateStagesForForm()

      } catch (error) {
        console.error('Erro ao carregar projetos por funil:', error)
      }
    }


    const updateStagesForForm = async () => {
      const funnelIdToUse = projectForm.funnelId || selectedFunilId.value

      console.log('📋 updateStagesForForm - funnelIdToUse:', funnelIdToUse)

      if (!funnelIdToUse) {
        console.log('❌ Nenhum funil selecionado')
        return
      }

      try {
        const data = await FunnelService.getStepsByFunnelId(funnelIdToUse)
        formStages.value = data.steps.map(step => ({ id: step.id, name: step.name }))

        console.log('✅ Etapas carregadas:', formStages.value)

        // Se for novo projeto, sempre seleciona a primeira etapa ao trocar de funil
        if (!editingProject.value && formStages.value.length > 0) {
          projectForm.stepId = formStages.value[0].id
          console.log('🎯 Primeira etapa selecionada automaticamente:', projectForm.stepId)
        }

        // Se for edição, verifica se a etapa atual ainda existe no funil
        if (editingProject.value && projectForm.stepId) {
          const stepExists = formStages.value.some(stage => stage.id === projectForm.stepId)
          if (!stepExists && formStages.value.length > 0) {
            // Se a etapa não existe mais, seleciona a primeira
            projectForm.stepId = formStages.value[0].id
            console.log('⚠️ Etapa anterior não existe, selecionando primeira:', projectForm.stepId)
          } else {
            console.log('✏️ Modo edição - mantendo etapa atual:', projectForm.stepId)
          }
        }

      } catch (error) {
        console.error('Erro ao carregar etapas para o formulário:', error)
      }
    }

    const saveProject = async () => {
      if (!validateProjectForm()) {
        return // Impede o salvamento se houver erros de validação
      }

      try {
        if (projectForm.id) {
          await ProjectService.updateProject(projectForm.id, {
            ...projectForm,
          })
          console.log('Projeto atualizado com sucesso!')
        } else {
          await ProjectService.createProject(projectForm)
          console.log('Projeto criado com sucesso!')
        }

        await loadProjetosByFunil()
        closeOffcanvas()
        resetForm()

      } catch (error) {
        console.error('Erro ao salvar projeto:', error)
      }
    }

    const moveProject = async (projectId, newStepId) => {
      const project = projects.value.find(p => p.id === projectId)
      if (!project) return

      try {
        const currentProjectData = {
          id: project.id,
          name: project.name,
          description: project.description,
          customer: project.customer,
          startDate: project.startDate ? project.startDate.substring(0, 10) : '',
          endDate: project.endDate ? project.endDate.substring(0, 10) : '',
          userId: project.userId || 1,
          stepId: project.stepId,
          isArchived: project.isArchived
        }

        await ProjectService.moveProjectStage(projectId, newStepId, currentProjectData)

        project.stage = newStepId
        project.stepId = newStepId

        await loadProjetosByFunil()

      } catch (error) {
        console.error('Erro ao mover projeto:', error)
        await loadProjetosByFunil()
      }
    }

    const editProject = async (project) => {
      console.log('🎯 Projetos.vue - editProject recebeu:', project)
      editingProject.value = project

      // Encontra o funil do projeto
      const currentFunnel = funnels.value.find(f => f.steps.some(s => s.id === project.stepId))

      if (currentFunnel) {
        console.log('📁 Funil encontrado:', currentFunnel.name)
        projectForm.funnelId = currentFunnel.id

        // Carrega as etapas do funil ANTES de preencher o formulário
        await updateStagesForForm()
      }

      // Preenche o formulário
      Object.assign(projectForm, {
        id: project.id,
        name: project.name,
        customer: project.customer,
        stepId: project.stepId,
        description: project.description,
        startDate: project.startDate ? project.startDate.substring(0, 10) : '',
        endDate: project.endDate ? project.endDate.substring(0, 10) : '',
        userId: project.userId || 1,
        isArchived: project.isArchived
      })

      console.log('📝 Formulário preenchido:', projectForm)

      // Abre o offcanvas
      const offcanvasElement = document.getElementById('offcanvasNovoProjeto')
      const offcanvasInstance = Offcanvas.getOrCreateInstance(offcanvasElement)
      offcanvasInstance.show()
    }

    const archiveProject = async () => {
      if (!projectForm.id) return

      if (confirm('Tem certeza que deseja arquivar este projeto? Ele será removido da visualização do Kanban.')) {
        try {
          await ProjectService.archiveProject(projectForm.id)
          console.log('Projeto arquivado com sucesso!')

          await loadProjetosByFunil()
          closeOffcanvas()
          resetForm()

        } catch (error) {
          console.error('Erro ao arquivar projeto:', error)
        }
      }
    }

    const resetForm = () => {
      Object.assign(projectForm, {
        id: null,
        name: '',
        contactId: contacts.value.length > 0 ? contacts.value[0].id : null,
        funnelId: selectedFunilId.value,
        stepId: null,
        description: '',
        startDate: '',
        endDate: '',
        userId: users.value.length > 0 ? users.value[0].id : 1
      })
      editingProject.value = null
      projectErrors.value = {} // Limpa os erros ao resetar o formulário
    }

    const resetFormAndOpenOffcanvas = () => {
      resetForm()
      projectForm.funnelId = selectedFunilId.value
      updateStagesForForm()
    }

    const closeOffcanvas = () => {
      const offcanvasElement = document.getElementById('offcanvasNovoProjeto')
      const offcanvasInstance = Offcanvas.getInstance(offcanvasElement)
      if (offcanvasInstance) {
        offcanvasInstance.hide()
      }
    }

    const projectToArchive = ref(null)

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
        await loadProjetosByFunil()

        // Fecha modal
        const modalEl = document.getElementById('confirmArchiveProjectModal')
        const modal = Modal.getInstance(modalEl)
        modal.hide()

        closeOffcanvas()
        resetForm()
      } catch (error) {
        console.error('Erro ao (des)arquivar projeto:', error)
      }
    }

    onMounted(() => {
      loadFunnels()
      loadActiveUsers()
      loadContacts()
    })

    return {
      selectedFunilId,
      archivedFilter,
      funnels,
      users,
      contacts,
      editingProject,
      projectForm,
      projectErrors, // Adicionado para exposição no template
      kanbanColumns,
      projects,
      formStages,
      loadProjetosByFunil,
      moveProject,
      saveProject,
      archiveProject,
      resetFormAndOpenOffcanvas,
      editProject,
      loadActiveUsers,
      hasLevelConfig,
      updateStagesForForm,
      projectToArchive,
      openArchiveModal,
      confirmArchiveProject,
      validateProjectName, // Adicionado para validação inline
      validateProjectContact, // Adicionado para validação inline
      validateProjectFunnel, // Adicionado para validação inline
      validateProjectStep, // Adicionado para validação inline
      validateProjectDates // Adicionado para validação inline
    }
  }
}
</script>

<style scoped>
.projetos-page {
  padding: 0;
}
</style>