<template>
  <div 
    class="kanban-card"
    draggable="true"
    @dragstart="onDragStart"
    @click="editProject"
  >
    <h5>{{ project.name }}</h5>
    <p>{{ project.customer }}</p>
    <p>{{ project.description }}</p>
    <div class="kanban-card-footer">
      <span>Prazo: {{ project.deadline }}</span>
      <div class="card-actions">
        <button 
          class="btn btn-sm btn-outline-primary"
          @click.stop="editProject"
          title="Editar projeto"
        >
          <i class="bi bi-pencil"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KanbanCard',
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  emits: ['dragstart', 'edit-project'],
  setup(props, { emit }) {
    const onDragStart = (event) => {
      console.log('🚀 KanbanCard - Iniciando drag:', props.project.id)
      
      event.dataTransfer.effectAllowed = 'move'
      
      // Emite o evento com os dados do projeto E o evento nativo
      emit('dragstart', {
        projectId: props.project.id,
        stageId: props.project.stage,
        dragEvent: event
      })
    }
    
    const editProject = () => {
      console.log('✏️ KanbanCard - editProject chamado, projeto:', props.project)
      emit('edit-project', props.project)
      console.log('✏️ KanbanCard - Evento edit-project emitido')
    }
    
    return {
      onDragStart,
      editProject
    }
  }
}
</script>

<style scoped>
.kanban-card {
  background-color: white;
  border-radius: 0.375rem;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  cursor: grab;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #e9ecef;
}

.kanban-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.15);
}

.kanban-card:active {
  cursor: grabbing;
}

.kanban-card h5 {
  font-size: 1rem;
  margin-bottom: 0.25rem;
  color: var(--primary-color);
  font-weight: 600;
}

.kanban-card p {
  font-size: 0.875rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.kanban-card-footer {
  font-size: 0.75rem;
  color: #adb5bd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-actions {
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.kanban-card:hover .card-actions {
  opacity: 1;
}

.card-actions .btn {
  padding: 0.125rem 0.25rem;
  font-size: 0.75rem;
}
</style>