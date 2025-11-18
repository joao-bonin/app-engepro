<template>
  <div class="usuarios-page">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="page-title mb-0">Gestão de Usuários</h2>
      <button 
        class="btn btn-primary d-flex align-items-center"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasNovoUsuario"
        aria-controls="offcanvasNovoUsuario"
        @click="resetFormAndOpenOffcanvas"
      >
        <i class="bi bi-person-plus me-2"></i>Novo Usuário
      </button>
      <!-- Modal de Confirmação de Ativação/Inativação -->
    <div class="modal fade" id="confirmToggleUserModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ userToToggle?.active ? 'Confirmar Inativação' : 'Confirmar Ativação' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <template v-if="userToToggle?.active">
              Tem certeza que deseja <strong>inativar</strong> o usuário
              <strong>{{ userToToggle?.name }}</strong>?
              <br />
              <br />
              O usuário não poderá mais acessar o sistema, mas seus dados serão mantidos e poderão ser reativados a qualquer momento.
            </template>
            <template v-else>
              Tem certeza que deseja <strong>ativar</strong> o usuário
              <strong>{{ userToToggle?.name }}</strong>?
              <br />
              <br />
              O usuário voltará a ter acesso ao sistema.
            </template>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cancelar
            </button>
            <button type="button" class="btn" :class="userToToggle?.active ? 'btn-warning' : 'btn-success'"
              @click="confirmToggleUser">
              {{ userToToggle?.active ? 'Inativar' : 'Ativar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

    <!-- Tabela de Usuários -->
    <div class="card-custom">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">Email</th>
                <th scope="col">Nível de Acesso</th>
                <th scope="col">Status</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="usuario in filteredUsers" :key="usuario.id">
                <td>{{ usuario.name }}</td>
                <td>{{ usuario.email }}</td>
                <td>
                  <span 
                    class="badge badge-status" 
                    :class="usuario.hasLevelConfig ? 'badge-admin' : 'badge-user'"
                  >
                    {{ usuario.hasLevelConfig ? 'Configurador' : 'Acesso Básico' }}
                  </span>
                </td>
                <td>
                  <span 
                    class="badge" 
                    :class="usuario.active ? 'bg-success' : 'bg-secondary'"
                  >
                    {{ usuario.active ? 'Ativo' : 'Inativo' }}
                  </span>
                </td>
                <td>
                  <button 
                    class="btn btn-sm btn-warning me-1" 
                    @click="editUsuario(usuario)"
                    title="Editar"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="filteredUsers.length === 0">
                <td colspan="5" class="text-center text-muted py-4">
                  Nenhum usuário encontrado
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <!-- Offcanvas Novo/Editar Usuário -->
    <div class="offcanvas offcanvas-end offcanvas-custom" tabindex="-1" id="offcanvasNovoUsuario"
      aria-labelledby="offcanvasNovoUsuarioLabel" style="width: 500px;">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasNovoUsuarioLabel">
          {{ editingUsuario ? 'Editar Usuário' : 'Cadastrar Novo Usuário' }}
        </h5>
        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <form @submit.prevent="saveUsuario" novalidate>
          <!-- Nome -->
          <div class="mb-3">
            <label class="form-label">Nome Completo</label>
            <input 
              type="text" 
              class="form-control" 
              :class="{ 'is-invalid': usuarioErrors.name }"
              v-model="usuarioForm.name"
              @blur="validateName"
              @input="validateName"
            >
            <div class="invalid-feedback" v-if="usuarioErrors.name">
              {{ usuarioErrors.name }}
            </div>
          </div>

          <!-- Email -->
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input 
              type="email" 
              class="form-control" 
              :class="{ 'is-invalid': usuarioErrors.email }"
              v-model="usuarioForm.email"
              @blur="validateEmail"
              @input="validateEmail"
            >
            <div class="invalid-feedback" v-if="usuarioErrors.email">
              {{ usuarioErrors.email }}
            </div>
          </div>

          <!-- Senha (apenas para novo usuário) -->
          <div class="mb-3" v-if="!editingUsuario">
            <label class="form-label">Senha</label>
            <input 
              type="password" 
              class="form-control" 
              :class="{ 'is-invalid': usuarioErrors.password }"
              v-model="usuarioForm.password"
              minlength="8"
              @blur="validatePasswordGroup"
              @input="validatePasswordGroup"
            >
            <div class="invalid-feedback" v-if="usuarioErrors.password">
              {{ usuarioErrors.password }}
            </div>
            <small class="text-muted">Mínimo de 8 caracteres</small>
          </div>

          <!-- Confirmar Senha (apenas para novo usuário) -->
          <div class="mb-3" v-if="!editingUsuario">
            <label class="form-label">Confirmar Senha</label>
            <input 
              type="password" 
              class="form-control" 
              :class="{ 'is-invalid': usuarioErrors.confirmarSenha }"
              v-model="usuarioForm.confirmarSenha"
              minlength="8"
              @blur="validatePasswordGroup"
              @input="validatePasswordGroup"
            >
            <div class="invalid-feedback" v-if="usuarioErrors.confirmarSenha">
              {{ usuarioErrors.confirmarSenha }}
            </div>
          </div>

          <!-- Alterar Senha (apenas para edição) -->
          <div v-if="editingUsuario">
            <div class="mb-3">
              <div class="form-check">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  id="alterarSenhaCheck"
                  v-model="changePassword"
                >
                <label class="form-check-label" for="alterarSenhaCheck">
                  Alterar senha do usuário
                </label>
              </div>
            </div>

            <!-- Campos de senha (apenas se checkbox marcado) -->
            <div v-if="changePassword">
              <div class="mb-3">
                <label class="form-label">Nova Senha</label>
                <input 
                  type="password" 
                  class="form-control" 
                  :class="{ 'is-invalid': usuarioErrors.password }"
                  v-model="usuarioForm.password"
                  minlength="8"
                  @blur="validatePasswordGroup"
                  @input="validatePasswordGroup"
                >
                <div class="invalid-feedback" v-if="usuarioErrors.password">
                  {{ usuarioErrors.password }}
                </div>
                <small class="text-muted">Mínimo de 8 caracteres</small>
              </div>

              <div class="mb-3">
                <label class="form-label">Confirmar Nova Senha</label>
                <input 
                  type="password" 
                  class="form-control" 
                  :class="{ 'is-invalid': usuarioErrors.confirmarSenha }"
                  v-model="usuarioForm.confirmarSenha"
                  minlength="8"
                  @blur="validatePasswordGroup"
                  @input="validatePasswordGroup"
                >
                <div class="invalid-feedback" v-if="usuarioErrors.confirmarSenha">
                  {{ usuarioErrors.confirmarSenha }}
                </div>
              </div>
            </div>
          </div>

          <!-- Nível de Acesso -->
          <div class="mb-3">
            <label class="form-label">Nível de Acesso</label>
            <select 
              class="form-select" 
              :class="{ 'is-invalid': usuarioErrors.hasLevelConfig }"
              v-model="usuarioForm.hasLevelConfig"
              @change="validateAccessLevel"
            >
              <option :value="true">Configurador</option>
              <option :value="false">Acesso Básico</option>
            </select>
            <div class="invalid-feedback" v-if="usuarioErrors.hasLevelConfig">
              {{ usuarioErrors.hasLevelConfig }}
            </div>
          </div>

          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-primary d-flex align-items-center">
              {{ editingUsuario ? 'Salvar Alterações' : 'Salvar Usuário' }}
            </button>
            <button 
              v-if="editingUsuario" 
              type="button" 
              class="btn"
              :class="usuarioForm.active ? 'btn-warning' : 'btn-success'"
              @click="openToggleUserModalFromForm"
            >
              {{ usuarioForm.active ? 'Inativar Usuário' : 'Ativar Usuário' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import UserService from '../services/UserService'
import { Offcanvas, Modal } from 'bootstrap'

export default {
  name: 'Usuarios',
  setup() {
    const editingUsuario = ref(null)
    const userToToggle = ref(null) // Usuário que será ativado/inativado
    const changePassword = ref(false) // Controla se vai alterar a senha na edição
    const statusFilter = ref('all') // 'all' ou 'active'
    const usuarios = ref([])
    const usuarioErrors = ref({}) // Objeto para armazenar erros
    
    const usuarioForm = reactive({
      id: null,
      name: '',
      email: '',
      password: '',
      confirmarSenha: '',
      hasLevelConfig: false,
      active: true
    })

    // Funções de Validação Inline (apenas para o campo específico)
    const validateName = () => {
      if (!usuarioForm.name || usuarioForm.name.trim() === "") {
        usuarioErrors.value.name = "O nome é obrigatório."
      } else {
        delete usuarioErrors.value.name
      }
    }

    const validateEmail = () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!usuarioForm.email || usuarioForm.email.trim() === "") {
        usuarioErrors.value.email = "O email é obrigatório."
      } else if (!emailRegex.test(usuarioForm.email)) {
        usuarioErrors.value.email = "O email deve ser válido."
      } else {
        delete usuarioErrors.value.email
      }
    }

    const validatePasswordGroup = () => {
      const isNewUser = !editingUsuario.value
      const isChangingPassword = editingUsuario.value && changePassword.value
      
      // Limpa erros de senha e confirmação
      delete usuarioErrors.value.password
      delete usuarioErrors.value.confirmarSenha

      if (isNewUser || isChangingPassword) {
        if (!usuarioForm.password) {
          usuarioErrors.value.password = "A senha é obrigatória."
        } else if (usuarioForm.password.length < 8) {
          usuarioErrors.value.password = "A senha deve ter no mínimo 8 caracteres."
        }

        if (!usuarioForm.confirmarSenha) {
          usuarioErrors.value.confirmarSenha = "A confirmação de senha é obrigatória."
        } else if (usuarioForm.password !== usuarioForm.confirmarSenha) {
          usuarioErrors.value.confirmarSenha = "As senhas não coincidem."
        }
      }
    }

    const validateAccessLevel = () => {
      // Como é um select com valores booleanos, a validação é mais simples
      if (usuarioForm.hasLevelConfig === null || usuarioForm.hasLevelConfig === undefined) {
        usuarioErrors.value.hasLevelConfig = "O nível de acesso é obrigatório."
      } else {
        delete usuarioErrors.value.hasLevelConfig
      }
    }

    // Função de Validação Completa (chamada apenas no saveUsuario)
    const validateUsuarioForm = () => {
      usuarioErrors.value = {} // Limpa todos os erros antes de validar

      // Chamadas para preencher o objeto de erros
      // Nota: As funções de validação inline precisam ser adaptadas para apenas PREENCHER o objeto de erro
      // sem limpá-lo, ou criamos funções auxiliares para a validação completa.
      // Vou manter as funções atuais e apenas chamá-las, pois elas já limpam o erro se estiverem OK.
      // Para a validação completa, precisamos garantir que elas validem o estado atual do formulário.

      // Para a validação completa, vamos recriar a lógica para garantir que todos os campos sejam verificados
      
      // 1. Nome
      if (!usuarioForm.name || usuarioForm.name.trim() === "") {
        usuarioErrors.value.name = "O nome é obrigatório."
      }

      // 2. Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!usuarioForm.email || usuarioForm.email.trim() === "") {
        usuarioErrors.value.email = "O email é obrigatório."
      } else if (!emailRegex.test(usuarioForm.email)) {
        usuarioErrors.value.email = "O email deve ser válido."
      }

      // 3. Senhas
      const isNewUser = !editingUsuario.value
      const isChangingPassword = editingUsuario.value && changePassword.value

      if (isNewUser || isChangingPassword) {
        if (!usuarioForm.password) {
          usuarioErrors.value.password = "A senha é obrigatória."
        } else if (usuarioForm.password.length < 8) {
          usuarioErrors.value.password = "A senha deve ter no mínimo 8 caracteres."
        }

        if (!usuarioForm.confirmarSenha) {
          usuarioErrors.value.confirmarSenha = "A confirmação de senha é obrigatória."
        } else if (usuarioForm.password !== usuarioForm.confirmarSenha) {
          usuarioErrors.value.confirmarSenha = "As senhas não coincidem."
        }
      }

      // 4. Nível de Acesso
      if (usuarioForm.hasLevelConfig === null || usuarioForm.hasLevelConfig === undefined) {
        usuarioErrors.value.hasLevelConfig = "O nível de acesso é obrigatório."
      }

      return Object.keys(usuarioErrors.value).length === 0
    }

    // Computed para filtrar usuários
    const filteredUsers = computed(() => {
      if (statusFilter.value === 'active') {
        return usuarios.value.filter(u => u.active)
      }
      return usuarios.value
    })

    // Carregar usuários
    const loadUsers = async () => {
      try {
        const data = await UserService.getAllUsers()
        usuarios.value = data
        console.log('✅ Usuários carregados:', data)
      } catch (error) {
        console.error('❌ Erro ao carregar usuários:', error)
        alert('Erro ao carregar usuários. Verifique o console.')
      }
    }

    // Editar usuário
    const editUsuario = (usuario) => {
      console.log('✏️ Editando usuário:', usuario)
      editingUsuario.value = usuario
      changePassword.value = false // Reseta o checkbox

      Object.assign(usuarioForm, {
        id: usuario.id,
        name: usuario.name,
        email: usuario.email,
        password: '',
        confirmarSenha: '',
        hasLevelConfig: usuario.hasLevelConfig,
        active: usuario.active
      })

      const offcanvasElement = document.getElementById('offcanvasNovoUsuario')
      const offcanvasInstance = Offcanvas.getOrCreateInstance(offcanvasElement)
      offcanvasInstance.show()
    }

    // Abrir modal de confirmação (da tabela)
    const openToggleUserModal = (usuario) => {
      userToToggle.value = usuario
      const modal = new Modal(document.getElementById('confirmToggleUserModal'))
      modal.show()
    }

    // Abrir modal de confirmação (do offcanvas)
    const openToggleUserModalFromForm = () => {
      if (!editingUsuario.value) return
      
      // Cria um objeto com os dados do formulário para o modal
      userToToggle.value = {
        id: usuarioForm.id,
        name: usuarioForm.name,
        email: usuarioForm.email,
        active: usuarioForm.active,
        hasLevelConfig: usuarioForm.hasLevelConfig
      }
      
      const modal = new Modal(document.getElementById('confirmToggleUserModal'))
      modal.show()
    }

    // Confirmar ativação/inativação
    const confirmToggleUser = async () => {
      if (!userToToggle.value) return

      const action = userToToggle.value.active ? 'inativar' : 'ativar'
      const actionPast = userToToggle.value.active ? 'inativado' : 'ativado'
      
      try {
        const updateData = {
          name: userToToggle.value.name,
          email: userToToggle.value.email,
          hasLevelConfig: userToToggle.value.hasLevelConfig,
          active: !userToToggle.value.active
        }

        await UserService.updateUser(userToToggle.value.id, updateData)
        console.log(`✅ Usuário ${actionPast} com sucesso!`)
        
        await loadUsers()
        
        // Fechar o modal de confirmação
        const modal = Modal.getInstance(document.getElementById('confirmToggleUserModal'))
        if (modal) {
          modal.hide()
        }
        
        // Se veio do offcanvas, fechar também
        if (editingUsuario.value && editingUsuario.value.id === userToToggle.value.id) {
          closeOffcanvas()
          resetForm()
        }
        
        userToToggle.value = null
        
      } catch (error) {
        console.error(`❌ Erro ao ${action} usuário:`, error)
        alert(`Erro ao ${action} usuário. Verifique o console.`)
      }
    }

    // Salvar usuário (criar ou editar)
    const saveUsuario = async () => {
      if (!validateUsuarioForm()) {
        // Se a validação falhar, o erro será exibido inline
        return
      }

      try {
        if (editingUsuario.value) {
          // Editar usuário existente
          const updateData = {
            name: usuarioForm.name,
            email: usuarioForm.email,
            hasLevelConfig: usuarioForm.hasLevelConfig,
            active: usuarioForm.active
          }

          // Se marcou para alterar senha, incluir no update
          if (changePassword.value && usuarioForm.password) {
            updateData.password = usuarioForm.password
          }

          await UserService.updateUser(usuarioForm.id, updateData)
          console.log('✅ Usuário atualizado com sucesso!')
        } else {
          // Criar novo usuário
          const newUserData = {
            name: usuarioForm.name,
            email: usuarioForm.email,
            password: usuarioForm.password,
            hasLevelConfig: usuarioForm.hasLevelConfig
          }

          await UserService.createUser(newUserData)
          console.log('✅ Usuário criado com sucesso!')
        }

        await loadUsers()
        closeOffcanvas()
        resetForm()

      } catch (error) {
        console.error('❌ Erro ao salvar usuário:', error)
        
        // Tentar extrair mensagens de erro do backend
        try {
          const errorObj = JSON.parse(error.message)
          if (errorObj.errors) {
            const errorMessages = Object.values(errorObj.errors).flat().join('\n')
            alert('Erro de validação:\n' + errorMessages)
          } else {
            alert('Erro ao salvar usuário: ' + error.message)
          }
        } catch {
          alert('Erro ao salvar usuário. Verifique o console.')
        }
      }
    }

    // Resetar formulário
    const resetForm = () => {
      Object.assign(usuarioForm, {
        id: null,
        name: '',
        email: '',
        password: '',
        confirmarSenha: '',
        hasLevelConfig: false,
        active: true
      })
      editingUsuario.value = null
      changePassword.value = false
      usuarioErrors.value = {} // Limpa os erros ao resetar o formulário
    }

    // Resetar e abrir offcanvas
    const resetFormAndOpenOffcanvas = () => {
      resetForm()
    }

    // Fechar offcanvas
    const closeOffcanvas = () => {
      const offcanvasElement = document.getElementById('offcanvasNovoUsuario')
      const offcanvasInstance = Offcanvas.getInstance(offcanvasElement)
      if (offcanvasInstance) {
        offcanvasInstance.hide()
      }
    }

    onMounted(() => {
      loadUsers()
    })

    return {
      usuarios,
      filteredUsers,
      statusFilter,
      editingUsuario,
      userToToggle,
      changePassword,
      usuarioForm,
      loadUsers,
      editUsuario,
      openToggleUserModal,
      openToggleUserModalFromForm,
      confirmToggleUser,
      saveUsuario,
      resetFormAndOpenOffcanvas,
      usuarioErrors, // Expor erros para o template
      validateName, // Expor funções de validação para o template
      validateEmail,
      validatePasswordGroup,
      validateAccessLevel
    }
  }
}
</script>

<style scoped>
.usuarios-page {
  padding: 0;
}

.badge-admin {
  background-color: #dc3545;
  color: white;
}

.badge-user {
  background-color: #0d6efd;
  color: white;
}

.badge-status {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

.table th {
  background-color: var(--light-bg);
  color: var(--primary-color);
  font-weight: 600;
  border-bottom: 2px solid #dee2e6;
}

.table td {
  vertical-align: middle;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.card-custom {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  border: 1px solid #e9ecef;
}

.table-responsive {
  border-radius: 0.5rem;
}

.offcanvas-custom {
  box-shadow: -0.5rem 0 1rem rgba(0, 0, 0, 0.15);
}
</style>