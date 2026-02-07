<template>
  <div class="funis-etapas-page">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="page-title mb-0">Gestão de Funis e Etapas</h2>
      <button v-if="hasLevelConfig" class="btn btn-primary d-flex align-items-center" @click="openNewFunilModal">
        <i class="bi bi-plus-circle me-2"></i>Novo Funil
      </button>
    </div>

    <div class="accordion" id="accordionFunis">
      <div v-if="funis.length === 0" class="alert alert-info">
        Nenhum funil encontrado. Clique em "Novo Funil" para criar um.
      </div>
      <div v-for="funil in funis" :key="funil.id" class="accordion-item card-custom">
        <h2 class="accordion-header" :id="`headingFunil${funil.id}`">
          <button class="accordion-button" type="button" data-bs-toggle="collapse"
            :data-bs-target="`#collapseFunil${funil.id}`" aria-expanded="true"
            :aria-controls="`collapseFunil${funil.id}`">
            <strong>{{ funil.name }}</strong>
            <div v-if="funil.description">&nbsp; - &nbsp;{{ funil.description }}</div>
            <span v-if="funil.steps" class="badge bg-secondary ms-2">{{ funil.steps.length }} Etapas</span>
          </button>
        </h2>
        <div :id="`collapseFunil${funil.id}`" class="accordion-collapse collapse" :class="{ show: funil.id === 1 }"
          :aria-labelledby="`headingFunil${funil.id}`" data-bs-parent="#accordionFunis">
          <div class="accordion-body">
            <div class="d-flex justify-content-end mb-2">
              <button v-if="hasLevelConfig" class="btn btn-primary btn-sm me-2" @click="editFunil(funil)">
                <i class="bi bi-pencil me-1"></i>Editar Funil
              </button>
              <button v-if="hasLevelConfig" class="btn btn-sm btn-danger me-2" @click="openDeleteFunilModal(funil)">
                <i class="bi bi-trash me-1"></i>Excluir Funil
              </button>
              <button v-if="hasLevelConfig" class="btn btn-sm btn-primary" @click="addEtapa(funil.id)">
                <i class="bi bi-plus-circle me-1"></i>Nova Etapa
              </button>
            </div>

            <div v-if="funil.steps && funil.steps.length === 0" class="alert alert-info">
              O funil não possui etapas cadastradas. Clique em <strong>"Nova Etapa"</strong> para adicionar.
            </div>

            <ul v-if="funil.steps && funil.steps.length > 0" class="list-group">
              <li v-for="etapa in funil.steps" :key="etapa.id"
                class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{{ etapa.name }}</strong>
                  <span v-if="etapa.description" class="text-muted ms-2">- {{ etapa.description }}</span>
                </div>
                <div class="d-flex align-items-center">
                  <button v-if="hasLevelConfig" class="btn btn-sm btn-warning me-1" @click="editEtapa(etapa, funil.id)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button v-if="hasLevelConfig" class="btn btn-sm btn-danger" @click="openDeleteEtapaModal(etapa)">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>


    <!-- Modal Novo/Editar Funil -->
    <div class="modal fade" id="novoFunilModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ editingFunil ? 'Editar Funil' : 'Novo Funil' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveFunil" novalidate>
              <!-- Campo Nome -->
              <div class="mb-3">
                <label class="form-label">Nome <span class="text-danger">*</span></label>
                <input type="text" class="form-control" :class="{ 'is-invalid': funilErrors.name }"
                  v-model="funilForm.name" required>
                <div class="invalid-feedback">
                  {{ funilErrors.name || 'O nome do funil é obrigatório.' }}
                </div>
              </div>

              <!-- Campo Descrição -->
              <div class="mb-3">
                <label class="form-label">Descrição (opcional)</label>
                <textarea rows="3" maxlength="140" class="form-control"
                  :class="{ 'is-invalid': funilErrors.description }" v-model="funilForm.description"></textarea>
                <div class="invalid-feedback">
                  {{ funilErrors.description || 'A descrição deve ter no máximo 140 caracteres.' }}
                </div>
                <div class="form-text">
                  Máximo de 140 caracteres.
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary" @click="saveFunil">
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>



    <!-- Modal Nova/Editar Etapa -->
    <div class="modal fade" id="novaEtapaModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ editingEtapa ? 'Editar Etapa' : 'Nova Etapa' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveEtapa" novalidate>
              <div class="mb-3">
                <label class="form-label">Nome <span class="text-danger">*</span></label>
                <input type="text" class="form-control" :class="{ 'is-invalid': etapaErrors.name }"
                  v-model="etapaForm.name" required>
                <div class="invalid-feedback">
                  {{ etapaErrors.name || 'O nome da etapa é obrigatório.' }}
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Descrição (opcional)</label>
                <textarea rows="3" maxlength="140" class="form-control"
                  :class="{ 'is-invalid': etapaErrors.description }" v-model="etapaForm.description"></textarea>
                <div class="invalid-feedback">
                  {{ etapaErrors.description || 'A descrição deve ter no máximo 140 caracteres.' }}
                </div>
                <div class="form-text">
                  Máximo de 140 caracteres.
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary" @click="saveEtapa">
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmação de Exclusão de Funil -->
    <div class="modal fade" id="confirmDeleteFunilModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmar Exclusão</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            Tem certeza que deseja excluir o funil <strong>{{ funilToDelete?.name }}</strong>?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-danger" @click="confirmDeleteFunil">Excluir</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmação de Exclusão de Etapa -->
    <div class="modal fade" id="confirmDeleteEtapaModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmar Exclusão</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            Tem certeza que deseja excluir a etapa <strong>{{ etapaToDelete?.name }}</strong>?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-danger" @click="confirmDeleteEtapa">Excluir</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Aviso de Exclusão Bloqueada -->
    <div class="modal fade" id="deleteBlockedModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Não foi possível excluir</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            {{ deleteBlockedMessage }}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Entendi</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { Modal } from 'bootstrap'


export default {
  name: 'FunisEtapas',
  setup() {
    const funis = ref([]);
    const editingFunil = ref(null)
    const selectedFunilId = ref(null)
    const funilErrors = ref({})
    const funilToDelete = ref(null)
    const deleteBlockedMessage = ref('')

    const token = localStorage.getItem("token");
    const hasLevelConfig = ref(localStorage.getItem("hasLevelConfig") === "true")

    const funilForm = reactive({
      name: '',
      description: ''
    })

    const resetFunilForm = () => {
      funilForm.name = ''
      funilForm.description = ''
      editingFunil.value = null
      funilErrors.value = {}
    }

    const loadFunis = async () => {
      try {
        const response = await fetch('http://localhost:9000/funnel', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 422) {
          funilErrors.value = await response.json()
          return
        }

        if (!response.ok) throw new Error('Erro ao buscar os funis');

        const data = await response.json();
        funis.value = data;
        console.log('Funis carregados:', data);

      } catch (error) {
        console.error('Erro ao carregar funis:', error);
      }
    };

    onMounted(() => {
      loadFunis();
    });


    const editFunil = (funil) => {
      editingFunil.value = funil
      funilForm.name = funil.name
      funilForm.description = funil.description

      const modal = Modal.getOrCreateInstance(document.getElementById('novoFunilModal'))
      modal.show()
    }

    const openDeleteFunilModal = (funil) => {
      funilToDelete.value = funil
      const modal = Modal.getOrCreateInstance(document.getElementById('confirmDeleteFunilModal'))
      modal.show()
    }

    const openNewFunilModal = () => {
      resetFunilForm()
      const modal = Modal.getOrCreateInstance(document.getElementById('novoFunilModal'))
      modal.show()
    }

    const confirmDeleteFunil = async () => {
      if (!funilToDelete.value) return

      const id = funilToDelete.value.id

      try {
        const response = await fetch('http://localhost:9000/funnel/' + id, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) throw new Error('Erro ao deletar funil')

        const canDelete = await response.json()
        if (canDelete === false) {
          const modal = Modal.getOrCreateInstance(document.getElementById('confirmDeleteFunilModal'))
          modal.hide()
          deleteBlockedMessage.value = 'O funil não pode ser deletado, pois possui etapas vinculadas.'
          const blockedModal = Modal.getOrCreateInstance(document.getElementById('deleteBlockedModal'))
          blockedModal.show()
          return
        }

        const index = funis.value.findIndex(f => f.id === id)
        if (index !== -1) funis.value.splice(index, 1)

        const modal = Modal.getOrCreateInstance(document.getElementById('confirmDeleteFunilModal'))
        modal.hide()

      } catch (error) {
        console.error('Erro ao deletar funil:', error)
      }

      funilToDelete.value = null
    }

    const saveFunil = async () => {
      funilErrors.value = {}

      if (!funilForm.name || funilForm.name.trim() === "") {
        funilErrors.value.name = "O nome do funil é obrigatório."
      }

      if (Object.keys(funilErrors.value).length > 0) {
        return
      }

      if (editingFunil.value) {
        const editedFunnel = {
          name: funilForm.name,
          description: funilForm.description,
          etapas: editingFunil.value.etapas || []
        }

        try {
          const response = await fetch('http://localhost:9000/funnel/' + editingFunil.value.id, {
            method: 'PUT',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json;charset=UTF-8',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(editedFunnel)
          })

          if (response.status === 422) {
            funilErrors.value = await response.json()
            return
          }

          if (!response.ok) throw new Error('Erro ao atualizar o funil')

          const funnel = await response.json()
          const index = funis.value.findIndex(f => f.id === funnel.id)
          if (index !== -1) {
            funis.value[index] = funnel
          }

          closeModal('novoFunilModal')

        } catch (error) {
          console.error('Erro ao salvar funil:', error)
        }
      } else {
        const newFunnel = {
          name: funilForm.name,
          description: funilForm.description,
          etapas: []
        }

        try {
          const response = await fetch('http://localhost:9000/funnel', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json;charset=UTF-8',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newFunnel)
          })

          if (response.status === 422) {
            funilErrors.value = await response.json()
            return
          }

          if (!response.ok) throw new Error('Erro ao criar o funil')

          const createdFunil = await response.json()
          funis.value.push(createdFunil)

          closeModal('novoFunilModal')

        } catch (error) {
          console.error('Erro ao salvar funil:', error)
        }
      }

      resetFunilForm()
    }


    // #### Etapas
    const editingEtapa = ref(null)
    const etapaErrors = ref({})
    const etapaToDelete = ref(null)

    const etapaForm = reactive({
      name: '',
      description: ''
    })

    const resetEtapaForm = () => {
      etapaForm.name = ''
      etapaForm.description = ''
      editingEtapa.value = null
      selectedFunilId.value = null
      etapaErrors.value = {}
    }

    const addEtapa = (funilId) => {
      resetEtapaForm()
      selectedFunilId.value = funilId

      const modal = Modal.getOrCreateInstance(document.getElementById('novaEtapaModal'))
      modal.show()
    }

    const editEtapa = (etapa, funilId) => {
      editingEtapa.value = etapa
      selectedFunilId.value = funilId
      etapaForm.name = etapa.name
      etapaForm.description = etapa.description || ''

      const modal = Modal.getOrCreateInstance(document.getElementById('novaEtapaModal'))
      modal.show()
    }

    const openDeleteEtapaModal = (etapa) => {
      etapaToDelete.value = etapa
      const modal = Modal.getOrCreateInstance(document.getElementById('confirmDeleteEtapaModal'))
      modal.show()
    }

    const saveEtapa = async () => {
      etapaErrors.value = {}

      if (!etapaForm.name || etapaForm.name.trim() === "") {
        etapaErrors.value.name = "O nome da etapa é obrigatório."
      }

      if (Object.keys(etapaErrors.value).length > 0) {
        return
      }

      if (editingEtapa.value) {
        const editedStep = {
          name: etapaForm.name,
          description: etapaForm.description,
          funnelId: selectedFunilId.value
        }

        try {
          const response = await fetch('http://localhost:9000/step/' + editingEtapa.value.id, {
            method: 'PUT',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json;charset=UTF-8',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(editedStep)
          })

          if (response.status === 422) {
            etapaErrors.value = await response.json()
            return
          }

          if (!response.ok) throw new Error('Erro ao atualizar a etapa')

          await loadFunis()
          closeModal('novaEtapaModal')

        } catch (error) {
          console.error('Erro ao salvar etapa:', error)
        }
      } else {
        const newStep = {
          name: etapaForm.name,
          description: etapaForm.description,
          funnelId: selectedFunilId.value
        }

        try {
          const response = await fetch('http://localhost:9000/step', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json;charset=UTF-8',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newStep)
          })

          if (response.status === 422) {
            etapaErrors.value = await response.json()
            return
          }

          if (!response.ok) throw new Error('Erro ao criar a etapa')

          await loadFunis()
          closeModal('novaEtapaModal')

        } catch (error) {
          console.error('Erro ao salvar etapa:', error)
        }
      }

      resetEtapaForm()
    }

    const confirmDeleteEtapa = async () => {
      if (!etapaToDelete.value) return

      const id = etapaToDelete.value.id
      console.log('Deletando etapa com ID:', id)

      try {
        const response = await fetch('http://localhost:9000/step/' + id, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) throw new Error('Erro ao deletar etapa')

        const canDelete = await response.json()
        if (canDelete === false) {
          const modal = Modal.getOrCreateInstance(document.getElementById('confirmDeleteEtapaModal'))
          modal.hide()
          deleteBlockedMessage.value = 'A etapa não pode ser deletada, pois possui projetos vinculados.'
          const blockedModal = Modal.getOrCreateInstance(document.getElementById('deleteBlockedModal'))
          blockedModal.show()
          return
        }

        await loadFunis()

        const modal = Modal.getOrCreateInstance(document.getElementById('confirmDeleteEtapaModal'))
        modal.hide()

      } catch (error) {
        console.error('Erro ao deletar etapa:', error)
      }

      etapaToDelete.value = null
    }

    const closeModal = (modalId) => {
      const modalEl = document.getElementById(modalId)
      const modal = Modal.getOrCreateInstance(modalEl)
      modal.hide()

      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove())
      document.body.classList.remove('modal-open')
      document.body.style.removeProperty('overflow')
    }

    return {
      funis,
      editingFunil,
      editingEtapa,
      funilForm,
      etapaForm,
      editFunil,
      addEtapa,
      editEtapa,
      saveFunil,
      saveEtapa,
      funilErrors,
      etapaErrors,
      funilToDelete,
      etapaToDelete,
      deleteBlockedMessage,
      openDeleteFunilModal,
      openDeleteEtapaModal,
      confirmDeleteFunil,
      confirmDeleteEtapa,
      openNewFunilModal,
      hasLevelConfig
    }
  }
}
</script>

<style scoped>
.funis-etapas-page {
  padding: 0;
}

.accordion-button:not(.collapsed) {
  background-color: var(--light-bg);
  color: var(--primary-color);
}

.list-group-item {
  border: 1px solid #dee2e6;
}

.list-group-item:hover {
  background-color: #f8f9fa;
}

.bg-primary-custom {
  background-color: var(--primary-color, #007bff) !important;
}
</style>
