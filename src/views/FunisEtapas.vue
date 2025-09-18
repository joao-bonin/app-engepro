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
            <span v-if="funil.etapas" class="badge bg-secondary ms-2">{{ funil.etapas.length }} Etapas</span>
          </button>
        </h2>
        <div :id="`collapseFunil${funil.id}`" class="accordion-collapse collapse" :class="{ show: funil.id === 1 }"
          :aria-labelledby="`headingFunil${funil.id}`" data-bs-parent="#accordionFunis">
          <div class="accordion-body">
            <div class="d-flex justify-content-end mb-2">
              <button v-if="hasLevelConfig" class="btn btn-primary btn-sm me-2" @click="editFunil(funil)">
                <i class="bi bi-pencil me-1"></i>Editar Funil
              </button>
              <button v-if="hasLevelConfig" class="btn btn-sm btn-danger me-2" @click="openDeleteModal(funil)">
                <i class="bi bi-trash me-1"></i>Excluir Funil
              </button>
              <button v-if="hasLevelConfig" class="btn btn-sm btn-primary" @click="addEtapa(funil.id)">
                <i class="bi bi-plus-circle me-1"></i>Nova Etapa
              </button>
            </div>

            <ul class="list-group">
              <li v-for="etapa in funil.etapas" :key="etapa.id"
                class="list-group-item d-flex justify-content-between align-items-center">
                {{ etapa.name }}
                <span class="badge bg-primary-custom rounded-pill">{{ etapa.order }}</span>
                <div>
                  <button class="btn btn-sm btn-warning me-1" @click="editEtapa(etapa)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-danger" @click="deleteEtapa(etapa.id)">
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
            <form @submit.prevent="saveEtapa">
              <div class="mb-3">
                <label class="form-label">Nome:</label>
                <input type="text" class="form-control" v-model="etapaForm.name" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Descrição:</label>
                <textarea rows="3" class="form-control" v-model="etapaForm.order"></textarea>
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

    <!-- Modal de Confirmação de Exclusão -->
    <div class="modal fade" id="confirmDeleteModal" tabindex="-1">
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
    const funilErrors = ref([])
    const funilToDelete = ref(null)

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
      funilErrors.value = []
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

      // Abrir modal
      const modal = Modal.getOrCreateInstance(document.getElementById('novoFunilModal'))
      modal.show()
    }

    const openDeleteModal = (funil) => {
      funilToDelete.value = funil
      const modal = Modal.getOrCreateInstance(document.getElementById('confirmDeleteModal'))
      modal.show()
    }

    const openNewFunilModal = () => {
      resetFunilForm()  // limpa campos e erros
      const modal = Modal.getOrCreateInstance(document.getElementById('novoFunilModal'))
      modal.show()
    }

    const confirmDeleteFunil = async () => {
      if (!funilToDelete.value) return

      const id = funilToDelete.value.id

      // Remove da lista local
      const index = funis.value.findIndex(f => f.id === id)
      if (index !== -1) funis.value.splice(index, 1)

      // Fecha modal
      const modal = Modal.getOrCreateInstance(document.getElementById('confirmDeleteModal'))
      modal.hide()

      try {
        await fetch('http://localhost:9000/funnel/' + id, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${token}`
          }
        })
      } catch (error) {
        console.error('Erro ao deletar funil:', error)
      }

      funilToDelete.value = null
    }

    const saveFunil = async () => {
      // resetar erros a cada tentativa
      funilErrors.value = {}

      // validação simples
      if (!funilForm.name || funilForm.name.trim() === "") {
        funilErrors.value.name = "O nome do funil é obrigatório."
      }

      if (funilForm.description.length > 140) {
        funilErrors.value.description = "A descrição deve ter no máximo 140 caracteres."
      }

      // se tiver erros, não continua
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

          if (!response.ok) throw new Error('Erro ao atualizar o funil')

          const funnel = await response.json()
          const index = funis.value.findIndex(f => f.id === funnel.id)
          if (index !== -1) {
            funis.value[index] = funnel
          }

          const modalEl = document.getElementById('novoFunilModal')
          const modal = Modal.getOrCreateInstance(modalEl)
          modal.hide()

          document.querySelectorAll('.modal-backdrop').forEach(el => el.remove())
          document.body.classList.remove('modal-open')
          document.body.style.removeProperty('overflow')

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

          resetFunilForm()
          const modalEl = document.getElementById('novoFunilModal')
          const modal = Modal.getOrCreateInstance(modalEl)
          modal.hide()

          document.querySelectorAll('.modal-backdrop').forEach(el => el.remove())
          document.body.classList.remove('modal-open')
          document.body.style.removeProperty('overflow')

        } catch (error) {
          console.error('Erro ao salvar funil:', error)
        }
      }

      resetFunilForm()
    }



    // #### Etapas
    const editingEtapa = ref(null)

    const saveEtapa = () => {
      if (editingEtapa.value) {
        // Editar etapa existente
        editingEtapa.value.name = etapaForm.name
        editingEtapa.value.order = etapaForm.order
      } else {
        // Criar nova etapa
        const funil = funis.value.find(f => f.id === selectedFunilId.value)
        if (funil) {
          const newEtapa = {
            id: Date.now(),
            name: etapaForm.name,
            order: etapaForm.order,
            funilId: selectedFunilId.value
          }
          funil.etapas.push(newEtapa)
          funil.etapas.sort((a, b) => a.order - b.order)
        }
      }

      resetEtapaForm()
      // Fechar modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('novaEtapaModal'))
      modal.hide()
    }

    const etapaForm = reactive({
      name: '',
      order: 1
    })

    const addEtapa = (funilId) => {
      selectedFunilId.value = funilId
      editingEtapa.value = null
      etapaForm.name = ''
      etapaForm.order = 1

      // Abrir modal
      const modal = Modal.getOrCreateInstance(document.getElementById('novaEtapaModal'))
      modal.show()
    }

    const editEtapa = (etapa) => {
      editingEtapa.value = etapa
      etapaForm.name = etapa.name
      etapaForm.order = etapa.order

      // Abrir modal
      const modal = Modal.getOrCreateInstance(document.getElementById('novaEtapaModal'))
      modal.show()
    }

    const resetEtapaForm = () => {
      etapaForm.name = ''
      etapaForm.order = 1
      editingEtapa.value = null
      selectedFunilId.value = null
    }

    const deleteEtapa = (etapaId) => {
      if (confirm('Tem certeza que deseja excluir esta etapa?')) {
        funis.value.forEach(funil => {
          const index = funil.etapas.findIndex(e => e.id === etapaId)
          if (index !== -1) {
            console.log("Excluindo etapa:", etapaId);
            funil.etapas.splice(index, 1)
            fetch('http://localhost:9000/step/' + etapaId, {
              method: 'DELETE',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
              }
            });
          }
        })
      }
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
      deleteEtapa,
      saveFunil,
      saveEtapa,
      funilErrors,
      funilToDelete,
      openDeleteModal,
      confirmDeleteFunil,
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
</style>
