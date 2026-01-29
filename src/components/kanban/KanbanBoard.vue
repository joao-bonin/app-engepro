<template>
  <div class="kanban-board">
    <KanbanColumn
      v-for="column in columns"
      :key="column.id"
      :column="column"
      :projects="getProjectsByStage(column.id)"
      :has-level-config="hasLevelConfig"
      @move-project="$emit('move-project', $event.projectId, $event.newStage)"
      @edit-project="$emit('edit-project', $event)"
    />
  </div>
</template>

<script>
import KanbanColumn from './KanbanColumn.vue'

export default {
  name: 'KanbanBoard',
  components: {
    KanbanColumn
  },
  props: {
    columns: {
      type: Array,
      required: true
    },
    projects: {
      type: Array,
      required: true
    },
    hasLevelConfig: {
      type: Boolean,
      default: false
    }
  },
  emits: ['move-project', 'edit-project'],
  setup(props) {
    const getProjectsByStage = (stageId) => {
      return props.projects.filter(project => project.stage === stageId)
    }
    
    return {
      getProjectsByStage
    }
  }
}
</script>

<style scoped>
.kanban-board {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 1rem;
  min-height: 500px;
}

@media (max-width: 768px) {
  .kanban-board {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>