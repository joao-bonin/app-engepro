<template>
  <div class="projetos-page">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="page-title mb-0">Projetos</h2>
      <button 
        class="btn btn-primary-custom" 
        type="button" 
        data-bs-toggle="offcanvas" 
        data-bs-target="#offcanvasNovoProjeto" 
        aria-controls="offcanvasNovoProjeto"
      >
        <i class="bi bi-plus-circle me-2"></i>Novo Projeto
      </button>
    </div>
    
    <div class="mb-3">
      <label for="selectFunilKanban" class="form-label">Selecionar Funil:</label>
      <select 
        class="form-select" 
        id="selectFunilKanban"
        v-model="selectedFunil"
        @change="loadProjetosByFunil"
      >
        <option value="construcao">Construção</option>
        <option value="desenvolvimento">Funil de Desenvolvimento</option>
      </select>
    </div>
    
    <KanbanBoard 
      :columns="kanbanColumns" 
      :projects="projects"
      @move-project="moveProject"
    />
    
    <!-- Offcanvas Novo Projeto -->
    <div 
      class="offcanvas offcanvas-end offcanvas-custom" 
      tabindex="-1" 
      id="offcanvasNovoProjeto" 
      aria-labelledby="offcanvasNovoProjetoLabel" 
      style="width: 500px;"
    >
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasNovoProjetoLabel">
          {{ editingProject ? 'Editar Projeto' : 'Novo Projeto' }}
        </h5>
        <button 
          type="button" 
          class="btn-close text-reset" 
          data-bs-dismiss="offcanvas" 
          aria-label="Close"
        ></button>
      </div>
      <div class="offcanvas-body">
        <form @submit.prevent="saveProject">
          <div class="mb-3">
            <label class="form-label">Nome do Projeto</label>
            <input 
              type="text" 
              class="form-control"
              v-model="projectForm.name"
              required
            >
          </div>
          <div class="mb-3">
            <label class="form-label">Cliente</label>
            <input 
              type="text" 
              class="form-control"
              v-model="projectForm.client"
              required
            >
          </div>
          <div class="mb-3">
            <label class="form-label">Funil</label>
            <select class="form-select" v-model="projectForm.funil">
              <option value="construcao">Construção</option>
              <option value="desenvolvimento">Desenvolvimento</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Etapa Inicial</label>
            <select class="form-select" v-model="projectForm.stage">
              <option value="planejamento">Planejamento</option>
              <option value="fundacao">Fundação</option>
              <option value="estrutura">Estrutura</option>
              <option value="alvenaria">Alvenaria</option>
              <option value="acabamento">Acabamento</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Descrição</label>
            <textarea 
              class="form-control" 
              rows="3"
              v-model="projectForm.description"
            ></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Data de Início</label>
            <input 
              type="date" 
              class="form-control"
              v-model="projectForm.startDate"
            >
          </div>
          <div class="mb-3">
            <label class="form-label">Prazo Final</label>
            <input 
              type="date" 
              class="form-control"
              v-model="projectForm.endDate"
            >
          </div>
          
          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-primary-custom">
              {{ editingProject ? 'Salvar Alterações' : 'Salvar Projeto' }}
            </button>
            <button 
              v-if="editingProject" 
              type="button" 
              class="btn btn-warning"
              @click="archiveProject"
            >
              Arquivar Projeto
            </button>
            <button 
              v-if="editingProject" 
              type="button" 
              class="btn btn-danger"
              @click="deleteProject"
            >
              Excluir Projeto
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import KanbanBoard from '../components/kanban/KanbanBoard.vue'

export default {
  name: 'Projetos',
  components: {
    KanbanBoard
  },
  setup() {
    const selectedFunil = ref('construcao')
    const editingProject = ref(null)
    
    const projectForm = reactive({
      name: '',
      client: '',
      funil: 'construcao',
      stage: 'planejamento',
      description: '',
      startDate: '',
      endDate: ''
    })
    
    const kanbanColumns = ref([
      { id: 'planejamento', title: 'Planejamento', count: 2 },
      { id: 'fundacao', title: 'Fundação', count: 1 },
      { id: 'estrutura', title: 'Estrutura', count: 0 },
      { id: 'alvenaria', title: 'Alvenaria', count: 0 },
      { id: 'acabamento', title: 'Acabamento', count: 0 }
    ])
    
    const projects = ref([
      {
        id: 1,
        name: 'Projeto Alpha',
        client: 'Cliente X',
        description: 'desenvolvimento de app.',
        deadline: '30/07',
        stage: 'planejamento'
      },
      {
        id: 2,
        name: 'Consultoria Y',
        client: 'Cliente Z',
        description: 'análise de sistemas.',
        deadline: '15/08',
        stage: 'planejamento'
      },
      {
        id: 3,
        name: 'Website Corp',
        client: 'Cliente A',
        description: 'novo site institucional.',
        deadline: '10/09',
        stage: 'fundacao'
      }
    ])
    
    const loadProjetosByFunil = () => {
      // Implementar carregamento de projetos por funil
      console.log('Carregando projetos do funil:', selectedFunil.value)
    }
    
    const moveProject = (projectId, newStage) => {
      const project = projects.value.find(p => p.id === projectId)
      if (project) {
        project.stage = newStage
        updateColumnCounts()
      }
    }
    
    const updateColumnCounts = () => {
      kanbanColumns.value.forEach(column => {
        column.count = projects.value.filter(p => p.stage === column.id).length
      })
    }
    
    const saveProject = () => {
      if (editingProject.value) {
        // Editar projeto existente
        const index = projects.value.findIndex(p => p.id === editingProject.value.id)
        if (index !== -1) {
          projects.value[index] = { ...editingProject.value, ...projectForm }
        }
      } else {
        // Criar novo projeto
        const newProject = {
          id: Date.now(),
          ...projectForm
        }
        projects.value.push(newProject)
      }
      
      resetForm()
      updateColumnCounts()
    }
    
    const archiveProject = () => {
      // Implementar arquivamento
      console.log('Arquivar projeto')
    }
    
    const deleteProject = () => {
      if (editingProject.value) {
        const index = projects.value.findIndex(p => p.id === editingProject.value.id)
        if (index !== -1) {
          projects.value.splice(index, 1)
          resetForm()
          updateColumnCounts()
        }
      }
    }
    
    const resetForm = () => {
      Object.assign(projectForm, {
        name: '',
        client: '',
        funil: 'construcao',
        stage: 'planejamento',
        description: '',
        startDate: '',
        endDate: ''
      })
      editingProject.value = null
    }
    
    onMounted(() => {
      updateColumnCounts()
    })
    
    return {
      selectedFunil,
      editingProject,
      projectForm,
      kanbanColumns,
      projects,
      loadProjetosByFunil,
      moveProject,
      saveProject,
      archiveProject,
      deleteProject
    }
  }
}
</script>

<style scoped>
.projetos-page {
  padding: 0;
}
</style>

