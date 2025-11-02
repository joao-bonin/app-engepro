<template>
  <div class="projetos-page">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="page-title mb-0">Projetos</h2>
      <button class="btn btn-primary d-flex align-items-center" type="button" data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasNovoProjeto" aria-controls="offcanvasNovoProjeto" @click="resetFormAndOpenOffcanvas">
        <i class="bi bi-plus-circle me-2"></i>Novo Projeto
      </button>
    </div>

    <!-- Seletor de Funil -->
    <div class="mb-3">
      <label for="selectFunilKanban" class="form-label">Selecionar Funil:</label>
      <select class="form-select" id="selectFunilKanban" v-model="selectedFunilId" @change="loadProjetosByFunil">
        <option v-for="funil in funnels" :key="funil.id" :value="funil.id">
          {{ funil.name }}
        </option>
      </select>
    </div>

    <!-- Kanban Board -->
    <KanbanBoard :columns="kanbanColumns" :projects="projects" @move-project="moveProject"
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
            <input type="text" class="form-control" v-model="projectForm.name" required>
          </div>
          <!-- Cliente -->
          <div class="mb-3">
            <label class="form-label">Cliente</label>
            <input type="text" class="form-control" v-model="projectForm.customer" required>
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
          <!-- Funil -->
          <div class="mb-3">
            <label class="form-label">Funil</label>
            <select class="form-select" v-model="projectForm.funnelId" @change="updateStagesForForm">
              <option v-for="funil in funnels" :key="funil.id" :value="funil.id">
                {{ funil.name }}
              </option>
            </select>
          </div>
          <!-- Etapa Inicial -->
          <div class="mb-3">
            <label class="form-label">Etapa Inicial</label>
            <select class="form-select" v-model="projectForm.stepId">
              <option v-for="stage in formStages" :key="stage.id" :value="stage.id">
                {{ stage.name }}
              </option>
            </select>
          </div>
          <!-- Descrição -->
          <div class="mb-3">
            <label class="form-label">Descrição</label>
            <textarea class="form-control" rows="3" v-model="projectForm.description"></textarea>
          </div>
          <!-- Data de Início -->
          <div class="mb-3">
            <label class="form-label">Data de Início</label>
            <input type="date" class="form-control" v-model="projectForm.startDate">
          </div>
          <!-- Prazo Final -->
          <div class="mb-3">
            <label class="form-label">Prazo Final</label>
            <input type="date" class="form-control" v-model="projectForm.endDate">
          </div>
          <!-- Usuário (Mockado, pois o backend exige) -->
          <input type="hidden" v-model="projectForm.userId">

          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-primary d-flex align-items-center">
              {{ editingProject ? 'Salvar Alterações' : 'Salvar Projeto' }}
            </button>
            <button v-if="editingProject" type="button" class="btn btn-warning" @click="archiveProject">
              Arquivar Projeto
            </button>
            <!-- O backend não tem rota de exclusão, apenas arquivamento -->
          </div>
        </form>
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
import { Offcanvas } from 'bootstrap'

export default {
  name: 'Projetos',
  components: {
    KanbanBoard
  },
  setup() {
    // Dados do Kanban
    const selectedFunilId = ref(null)
    const funnels = ref([])
    const users = ref([])
    const kanbanColumns = ref([])
    const projects = ref([])

    // Dados do Formulário
    const editingProject = ref(null)
    const formStages = ref([])
    const projectForm = reactive({
      id: null,
      name: '',
      customer: '',
      funnelId: null,
      stepId: null,
      description: '',
      startDate: '',
      endDate: '',
      userId: 1
    })

    const loadFunnels = async () => {
      try {
        const data = await FunnelService.getAllFunnels()
        const funnelFiltered = data.filter(funnel => funnel.steps.length > 0)
        funnels.value = funnelFiltered
        if (funnelFiltered.length > 0) {
          selectedFunilId.value = funnelFiltered[0].id
          await loadProjetosByFunil()
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

    const loadProjetosByFunil = async () => {
      if (!selectedFunilId.value) return

      try {
        const data = await ProjectService.getProjectsByFunnelId(selectedFunilId.value)

        kanbanColumns.value = data.steps.map(step => ({
          id: step.id,
          title: step.name,
          count: step.projects.length
        }))

        projects.value = data.steps.flatMap(step =>
          step.projects.map(p => ({
            ...p,
            stage: p.stepId,
            deadline: p.endDate ? new Date(p.endDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' }) : 'N/A'
          }))
        )

        updateStagesForForm()

      } catch (error) {
        console.error('Erro ao carregar projetos por funil:', error)
      }
    }

    const updateStagesForForm = async () => {
      const funnelIdToUse = editingProject.value ? selectedFunilId.value : projectForm.funnelId
      if (!funnelIdToUse) return

      try {
        const data = await FunnelService.getStepsByFunnelId(funnelIdToUse)
        formStages.value = data.steps.map(step => ({ id: step.id, name: step.name }))

        if (!editingProject.value && formStages.value.length > 0) {
          projectForm.stepId = formStages.value[0].id
        }
      } catch (error) {
        console.error('Erro ao carregar etapas para o formulário:', error)
      }
    }

    const saveProject = async () => {
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
          isArchived: false
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

    const editProject = (project) => {
      console.log('🎯 Projetos.vue - editProject recebeu:', project)
      editingProject.value = project

      const currentFunnel = funnels.value.find(f => f.steps.some(s => s.id === project.stepId))
      if (currentFunnel) {
        selectedFunilId.value = currentFunnel.id
        projectForm.funnelId = currentFunnel.id
        updateStagesForForm()
      }

      Object.assign(projectForm, {
        id: project.id,
        name: project.name,
        customer: project.customer,
        stepId: project.stepId,
        description: project.description,
        startDate: project.startDate ? project.startDate.substring(0, 10) : '',
        endDate: project.endDate ? project.endDate.substring(0, 10) : '',
        userId: project.userId || 1
      })

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
        customer: '',
        funnelId: selectedFunilId.value,
        stepId: formStages.value.length > 0 ? formStages.value[0].id : null,
        description: '',
        startDate: '',
        endDate: '',
        userId: users.value.length > 0 ? users.value[0].id : 1
      })
      editingProject.value = null
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

    onMounted(() => {
      loadFunnels()
      loadActiveUsers()
    })

    return {
      selectedFunilId,
      funnels,
      users,
      editingProject,
      projectForm,
      kanbanColumns,
      projects,
      formStages,
      loadProjetosByFunil,
      moveProject,
      saveProject,
      archiveProject,
      resetFormAndOpenOffcanvas,
      editProject,
      loadActiveUsers
    }
  }
}
</script>

<style scoped>
.projetos-page {
  padding: 0;
}
</style>