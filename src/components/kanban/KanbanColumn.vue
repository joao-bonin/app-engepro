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
  emits: ['move-project'],
  setup(props, { emit }) {
    let draggedProjectId = null
    
    const onDragStart = (projectId) => {
      draggedProjectId = projectId
    }
    
    const onDrop = (event) => {
      event.preventDefault()
      
      if (draggedProjectId && draggedProjectId !== props.column.id) {
        emit('move-project', {
          projectId: draggedProjectId,
          newStage: props.column.id
        })
      }
      
      draggedProjectId = null
    }
    
    return {
      onDragStart,
      onDrop
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

