<template>
  <div class="usuarios-page">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="page-title mb-0">Gestão de Usuários</h2>
      <button 
        class="btn btn-primary-custom" 
        data-bs-toggle="modal" 
        data-bs-target="#novoUsuarioModal"
      >
        <i class="bi bi-person-plus me-2"></i>Novo Usuário
      </button>
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
                <th scope="col">Perfil</th>
                <th scope="col">Status</th>
                <th scope="col">Último Acesso</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="usuario in usuarios" :key="usuario.id">
                <td>{{ usuario.nome }}</td>
                <td>{{ usuario.email }}</td>
                <td>
                  <span 
                    class="badge badge-status" 
                    :class="usuario.perfil === 'admin' ? 'badge-admin' : 'badge-user'"
                  >
                    {{ usuario.perfil === 'admin' ? 'Administrador' : 'Usuário Comum' }}
                  </span>
                </td>
                <td>
                  <span 
                    class="badge" 
                    :class="usuario.status === 'ativo' ? 'bg-success' : 'bg-secondary'"
                  >
                    {{ usuario.status === 'ativo' ? 'Ativo' : 'Inativo' }}
                  </span>
                </td>
                <td>{{ formatDate(usuario.ultimoAcesso) }}</td>
                <td>
                  <button 
                    class="btn btn-sm btn-warning me-1" 
                    @click="editUsuario(usuario)"
                    title="Editar"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button 
                    class="btn btn-sm btn-danger" 
                    @click="deleteUsuario(usuario.id)"
                    title="Excluir"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <!-- Modal Novo/Editar Usuário -->
    <div class="modal fade" id="novoUsuarioModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ editingUsuario ? 'Editar Usuário' : 'Cadastrar Novo Usuário' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveUsuario">
              <div class="row mb-3">
                <div class="col-md-6">
                  <div class="form-floating mb-3">
                    <input 
                      type="text" 
                      class="form-control" 
                      id="nomeUsuario" 
                      placeholder="Nome completo"
                      v-model="usuarioForm.nome"
                      required
                    >
                    <label for="nomeUsuario">Nome Completo</label>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating mb-3">
                    <input 
                      type="email" 
                      class="form-control" 
                      id="emailUsuario" 
                      placeholder="Email"
                      v-model="usuarioForm.email"
                      required
                    >
                    <label for="emailUsuario">Email</label>
                  </div>
                </div>
              </div>
              
              <div class="row mb-3" v-if="!editingUsuario">
                <div class="col-md-6">
                  <div class="form-floating mb-3">
                    <input 
                      type="password" 
                      class="form-control" 
                      id="senhaUsuario" 
                      placeholder="Senha"
                      v-model="usuarioForm.senha"
                      :required="!editingUsuario"
                    >
                    <label for="senhaUsuario">Senha</label>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating mb-3">
                    <input 
                      type="password" 
                      class="form-control" 
                      id="confirmarSenhaUsuario" 
                      placeholder="Confirmar senha"
                      v-model="usuarioForm.confirmarSenha"
                      :required="!editingUsuario"
                    >
                    <label for="confirmarSenhaUsuario">Confirmar Senha</label>
                  </div>
                </div>
              </div>
              
              <div class="row mb-3">
                <div class="col-md-6">
                  <div class="form-floating mb-3">
                    <select 
                      class="form-select" 
                      id="perfilUsuario"
                      v-model="usuarioForm.perfil"
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="admin">Administrador</option>
                      <option value="user">Usuário Comum</option>
                    </select>
                    <label for="perfilUsuario">Perfil</label>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating mb-3">
                    <select 
                      class="form-select" 
                      id="statusUsuario"
                      v-model="usuarioForm.status"
                      required
                    >
                      <option value="ativo">Ativo</option>
                      <option value="inativo">Inativo</option>
                    </select>
                    <label for="statusUsuario">Status</label>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cancelar
            </button>
            <button type="button" class="btn btn-primary-custom" @click="saveUsuario">
              {{ editingUsuario ? 'Salvar Alterações' : 'Salvar Usuário' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'

export default {
  name: 'Usuarios',
  setup() {
    const editingUsuario = ref(null)
    
    const usuarioForm = reactive({
      nome: '',
      email: '',
      senha: '',
      confirmarSenha: '',
      perfil: '',
      status: 'ativo'
    })
    
    const usuarios = ref([
      {
        id: 1,
        nome: 'João Bonin',
        email: 'joao.bonin@engepro.com',
        perfil: 'admin',
        status: 'ativo',
        ultimoAcesso: new Date('2025-06-06T08:45:00')
      },
      {
        id: 2,
        nome: 'Admin Sistema',
        email: 'admin@engepro.com',
        perfil: 'admin',
        status: 'ativo',
        ultimoAcesso: new Date('2025-06-06T10:45:00')
      },
      {
        id: 3,
        nome: 'João Silva',
        email: 'joao.silva@engepro.com',
        perfil: 'user',
        status: 'ativo',
        ultimoAcesso: new Date('2025-06-05T16:20:00')
      },
      {
        id: 4,
        nome: 'Maria Oliveira',
        email: 'maria.oliveira@engepro.com',
        perfil: 'user',
        status: 'ativo',
        ultimoAcesso: new Date('2025-06-06T09:15:00')
      },
      {
        id: 5,
        nome: 'Pedro Santos',
        email: 'pedro.santos@engepro.com',
        perfil: 'user',
        status: 'inativo',
        ultimoAcesso: new Date('2025-06-01T14:30:00')
      },
      {
        id: 6,
        nome: 'Ana Pereira',
        email: 'ana.pereira@engepro.com',
        perfil: 'admin',
        status: 'ativo',
        ultimoAcesso: new Date('2025-06-06T08:45:00')
      }
    ])
    
    const formatDate = (date) => {
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    }
    
    const editUsuario = (usuario) => {
      editingUsuario.value = usuario
      Object.assign(usuarioForm, {
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
        status: usuario.status,
        senha: '',
        confirmarSenha: ''
      })
      
      // Abrir modal
      const modal = new bootstrap.Modal(document.getElementById('novoUsuarioModal'))
      modal.show()
    }
    
    const deleteUsuario = (usuarioId) => {
      if (confirm('Tem certeza que deseja excluir este usuário?')) {
        const index = usuarios.value.findIndex(u => u.id === usuarioId)
        if (index !== -1) {
          usuarios.value.splice(index, 1)
        }
      }
    }
    
    const saveUsuario = () => {
      // Validar senhas se for novo usuário
      if (!editingUsuario.value && usuarioForm.senha !== usuarioForm.confirmarSenha) {
        alert('As senhas não coincidem!')
        return
      }
      
      if (editingUsuario.value) {
        // Editar usuário existente
        const index = usuarios.value.findIndex(u => u.id === editingUsuario.value.id)
        if (index !== -1) {
          usuarios.value[index] = {
            ...usuarios.value[index],
            nome: usuarioForm.nome,
            email: usuarioForm.email,
            perfil: usuarioForm.perfil,
            status: usuarioForm.status
          }
        }
      } else {
        // Criar novo usuário
        const newUsuario = {
          id: Date.now(),
          nome: usuarioForm.nome,
          email: usuarioForm.email,
          perfil: usuarioForm.perfil,
          status: usuarioForm.status,
          ultimoAcesso: new Date()
        }
        usuarios.value.push(newUsuario)
      }
      
      resetForm()
      // Fechar modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('novoUsuarioModal'))
      modal.hide()
    }
    
    const resetForm = () => {
      Object.assign(usuarioForm, {
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: '',
        perfil: '',
        status: 'ativo'
      })
      editingUsuario.value = null
    }
    
    return {
      usuarios,
      editingUsuario,
      usuarioForm,
      formatDate,
      editUsuario,
      deleteUsuario,
      saveUsuario
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
  background-color: #28a745;
  color: white;
}

.table th {
  background-color: var(--light-bg);
  color: var(--primary-color);
  font-weight: 600;
}

.table td {
  vertical-align: middle;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}
</style>

