<template>
  <div 
    class="kanban-column"
    @drop="onDrop"
    @dragover.prevent
    @dragenter.prevent
  >
    <div class="kanban-column-header">
      {{ column.title }} ({{ projects.length }})
    </div>
    
    <KanbanCard
      v-for="project in projects"
      :key="project.id"
      :project="project"
      @dragstart="onDragStart"
      @edit-project="onEditProject"
    />
    
    <div v-if="projects.length === 0" class="empty-column">
      <p class="text-muted text-center">Nenhum projeto nesta etapa</p>
    </div>
  </div>
</template>

<script>
import KanbanCard from './KanbanCard.vue'

export default {
  name: 'KanbanColumn',
  components: {
    KanbanCard
  },
  props: {
    column: {
      type: Object,
      required: true
    },
    projects: {
      type: Array,
      required: true
    }
  },
  emits: ['move-project', 'edit-project'],
  setup(props, { emit }) {
    const onDragStart = (event) => {
      console.log('🎯 KanbanColumn - onDragStart recebeu:', event)
      event.dragEvent.dataTransfer.setData('projectData', JSON.stringify({
        projectId: event.projectId,
        stageId: event.stageId
      }))
      console.log('📦 Armazenado no dataTransfer')
    }
    
    const onEditProject = (project) => {
      console.log('✏️ KanbanColumn - Recebeu edit-project:', project)
      emit('edit-project', project)
      console.log('✏️ KanbanColumn - Reemitiu edit-project')
    }
    
    const onDrop = (event) => {
      event.preventDefault()
      console.log('🎪 KanbanColumn - onDrop chamado')
      
      try {
        const data = event.dataTransfer.getData('projectData')
        console.log('📥 Dados recuperados:', data)
        
        if (data) {
          const { projectId, stageId } = JSON.parse(data)
          console.log('   projectId:', projectId)
          console.log('   stageId origem:', stageId)
          console.log('   column.id destino:', props.column.id)
          
          if (stageId !== props.column.id) {
            console.log('✅ Emitindo move-project')
            emit('move-project', {
              projectId: projectId,
              newStage: props.column.id
            })
          } else {
            console.log('⚠️ Mesma coluna, não emitiu')
          }
        }
      } catch (error) {
        console.error('❌ Erro ao processar drop:', error)
      }
    }
    
    return {
      onDragStart,
      onDrop,
      onEditProject
    }
  }
}
</script>

<style scoped>
.kanban-column {
  min-width: 300px;
  max-width: 320px;
  background-color: var(--kanban-column-bg);
  border-radius: 0.5rem;
  padding: 0.75rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  min-height: 400px;
}

.kanban-column-header {
  font-weight: bold;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #ced4da;
  color: var(--secondary-color);
  text-align: center;
}

.empty-column {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  border: 2px dashed #dee2e6;
  border-radius: 0.5rem;
  margin-top: 1rem;
}

.empty-column p {
  margin: 0;
  font-style: italic;
}

@media (max-width: 768px) {
  .kanban-column {
    min-width: auto;
    max-width: 100%;
    margin-bottom: 1rem;
  }
}
</style>