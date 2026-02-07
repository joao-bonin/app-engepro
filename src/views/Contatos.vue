<template>
  <div class="contatos-page">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="page-title mb-0">Gestão de Contatos</h2>
      <button
        class="btn btn-primary d-flex align-items-center"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasNovoContato"
        aria-controls="offcanvasNovoContato"
        @click="resetFormAndOpenOffcanvas"
      >
        <i class="bi bi-person-plus me-2"></i>Novo Contato
      </button>
    </div>

    <!-- Tabela de Contatos -->
    <div class="card-custom">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">Email</th>
                <th scope="col">Telefone</th>
                <th scope="col">CNPJ</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="contato in contatos" :key="contato.id">
                <td>{{ contato.name }}</td>
                <td>{{ contato.email }}</td>
                <td>{{ contato.phone }}</td>
                <td>{{ contato.cnpj }}</td>
                <td>
                  <button class="btn btn-sm btn-warning me-1" @click="editContato(contato)" title="Editar">
                    <i class="bi bi-pencil"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="contatos.length === 0">
                <td colspan="6" class="text-center text-muted py-4">
                  Nenhum contato encontrado
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Offcanvas Novo/Editar Contato -->
    <div
      class="offcanvas offcanvas-end offcanvas-custom"
      tabindex="-1"
      id="offcanvasNovoContato"
      aria-labelledby="offcanvasNovoContatoLabel"
      style="width: 500px;"
    >
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasNovoContatoLabel">
          {{ editingContato ? 'Editar Contato' : 'Cadastrar Novo Contato' }}
        </h5>
        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <form @submit.prevent="saveContato" novalidate>
          <div class="mb-3">
            <label class="form-label">Nome Completo</label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': contatoErrors.name }"
              v-model="contatoForm.name"
              @blur="validateName"
              @input="validateName"
            />
            <div class="invalid-feedback" v-if="contatoErrors.name">
              {{ contatoErrors.name }}
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Email</label>
            <input
              type="email"
              class="form-control"
              :class="{ 'is-invalid': contatoErrors.email }"
              v-model="contatoForm.email"
              @blur="validateEmail"
              @input="validateEmail"
            />
            <div class="invalid-feedback" v-if="contatoErrors.email">
              {{ contatoErrors.email }}
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Telefone</label>
            <input
              type="tel"
              class="form-control"
              :class="{ 'is-invalid': contatoErrors.phone }"
              v-model="contatoForm.phone"
              @blur="validatePhone"
              @input="validatePhone"
            />
            <div class="invalid-feedback" v-if="contatoErrors.phone">
              {{ contatoErrors.phone }}
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">CNPJ</label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': contatoErrors.cnpj }"
              v-model="contatoForm.cnpj"
              @blur="validateCnpj"
              @input="validateCnpj"
            />
            <div class="invalid-feedback" v-if="contatoErrors.cnpj">
              {{ contatoErrors.cnpj }}
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Observações</label>
            <textarea class="form-control" rows="3" v-model="contatoForm.observations"></textarea>
          </div>

          <hr class="my-4" />

          <h6 class="mb-3">Endereço</h6>

          <div class="mb-3">
            <label class="form-label">Logradouro</label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': contatoErrors.street }"
              v-model="contatoForm.address.street"
              @blur="validateAddressField('street')"
              @input="validateAddressField('street')"
            />
            <div class="invalid-feedback" v-if="contatoErrors.street">
              {{ contatoErrors.street }}
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Número</label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': contatoErrors.number }"
              v-model="contatoForm.address.number"
              @blur="validateAddressField('number')"
              @input="validateAddressField('number')"
            />
            <div class="invalid-feedback" v-if="contatoErrors.number">
              {{ contatoErrors.number }}
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Bairro</label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': contatoErrors.quarter }"
              v-model="contatoForm.address.quarter"
              @blur="validateAddressField('quarter')"
              @input="validateAddressField('quarter')"
            />
            <div class="invalid-feedback" v-if="contatoErrors.quarter">
              {{ contatoErrors.quarter }}
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Cidade</label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': contatoErrors.city }"
              v-model="contatoForm.address.city"
              @blur="validateAddressField('city')"
              @input="validateAddressField('city')"
            />
            <div class="invalid-feedback" v-if="contatoErrors.city">
              {{ contatoErrors.city }}
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Estado</label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': contatoErrors.state }"
              v-model="contatoForm.address.state"
              @blur="validateAddressField('state')"
              @input="validateAddressField('state')"
            />
            <div class="invalid-feedback" v-if="contatoErrors.state">
              {{ contatoErrors.state }}
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">CEP</label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': contatoErrors.zipCode }"
              v-model="contatoForm.address.zipCode"
              @blur="validateAddressField('zipCode')"
              @input="validateAddressField('zipCode')"
            />
            <div class="invalid-feedback" v-if="contatoErrors.zipCode">
              {{ contatoErrors.zipCode }}
            </div>
          </div>

          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-primary d-flex align-items-center">
              {{ editingContato ? 'Salvar Alterações' : 'Salvar Contato' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { Offcanvas } from 'bootstrap'
import ContactService from '../services/ContactService'

export default {
  name: 'Contatos',
  setup() {
    const editingContato = ref(null)
    const contatos = ref([])
    const contatoErrors = ref({})

    const contatoForm = reactive({
      id: null,
      name: '',
      email: '',
      phone: '',
      cnpj: '',
      observations: '',
      address: {
        street: '',
        number: '',
        city: '',
        state: '',
        quarter: '',
        zipCode: ''
      }
    })

    const validateName = () => {
      if (!contatoForm.name || contatoForm.name.trim() === '') {
        contatoErrors.value.name = 'O nome é obrigatório.'
      } else {
        delete contatoErrors.value.name
      }
    }

    const validateEmail = () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!contatoForm.email || contatoForm.email.trim() === '') {
        contatoErrors.value.email = 'O email é obrigatório.'
      } else if (!emailRegex.test(contatoForm.email)) {
        contatoErrors.value.email = 'O email deve ser válido.'
      } else {
        delete contatoErrors.value.email
      }
    }

    const validatePhone = () => {
      const phoneRegex = /^[0-9()+\\s-]{8,20}$/
      if (!contatoForm.phone || contatoForm.phone.trim() === '') {
        contatoErrors.value.phone = 'O telefone é obrigatório.'
      } else if (!phoneRegex.test(contatoForm.phone)) {
        contatoErrors.value.phone = 'O telefone deve ser válido.'
      } else {
        delete contatoErrors.value.phone
      }
    }

    const validateCnpj = () => {
      const cnpjRegex = /^[0-9.\\/-]{14,18}$/
      if (!contatoForm.cnpj || contatoForm.cnpj.trim() === '') {
        contatoErrors.value.cnpj = 'O CNPJ é obrigatório.'
      } else if (!cnpjRegex.test(contatoForm.cnpj)) {
        contatoErrors.value.cnpj = 'O CNPJ deve ser válido.'
      } else {
        delete contatoErrors.value.cnpj
      }
    }

    const validateAddressField = (field) => {
      const labels = {
        street: 'O logradouro é obrigatório.',
        number: 'O número é obrigatório.',
        city: 'A cidade é obrigatória.',
        state: 'O estado é obrigatório.',
        quarter: 'O bairro é obrigatório.',
        zipCode: 'O CEP é obrigatório.'
      }

      if (!contatoForm.address[field] || contatoForm.address[field].trim() === '') {
        contatoErrors.value[field] = labels[field]
      } else {
        delete contatoErrors.value[field]
      }
    }

    const validateContatoForm = () => {
      contatoErrors.value = {}

      if (!contatoForm.name || contatoForm.name.trim() === '') {
        contatoErrors.value.name = 'O nome é obrigatório.'
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!contatoForm.email || contatoForm.email.trim() === '') {
        contatoErrors.value.email = 'O email é obrigatório.'
      } else if (!emailRegex.test(contatoForm.email)) {
        contatoErrors.value.email = 'O email deve ser válido.'
      }

      const phoneRegex = /^[0-9()+\\s-]{8,20}$/
      if (!contatoForm.phone || contatoForm.phone.trim() === '') {
        contatoErrors.value.phone = 'O telefone é obrigatório.'
      } else if (!phoneRegex.test(contatoForm.phone)) {
        contatoErrors.value.phone = 'O telefone deve ser válido.'
      }

      const cnpjRegex = /^[0-9.\\/-]{14,18}$/
      if (!contatoForm.cnpj || contatoForm.cnpj.trim() === '') {
        contatoErrors.value.cnpj = 'O CNPJ é obrigatório.'
      } else if (!cnpjRegex.test(contatoForm.cnpj)) {
        contatoErrors.value.cnpj = 'O CNPJ deve ser válido.'
      }

      if (!contatoForm.address.street || contatoForm.address.street.trim() === '') {
        contatoErrors.value.street = 'O logradouro é obrigatório.'
      }

      if (!contatoForm.address.number || contatoForm.address.number.trim() === '') {
        contatoErrors.value.number = 'O número é obrigatório.'
      }

      if (!contatoForm.address.quarter || contatoForm.address.quarter.trim() === '') {
        contatoErrors.value.quarter = 'O bairro é obrigatório.'
      }

      if (!contatoForm.address.city || contatoForm.address.city.trim() === '') {
        contatoErrors.value.city = 'A cidade é obrigatória.'
      }

      if (!contatoForm.address.state || contatoForm.address.state.trim() === '') {
        contatoErrors.value.state = 'O estado é obrigatório.'
      }

      if (!contatoForm.address.zipCode || contatoForm.address.zipCode.trim() === '') {
        contatoErrors.value.zipCode = 'O CEP é obrigatório.'
      }

      return Object.keys(contatoErrors.value).length === 0
    }

    const loadContacts = async () => {
      try {
        const data = await ContactService.getAllContacts()
        contatos.value = data
        console.log('✅ Contatos carregados:', data)
      } catch (error) {
        console.error('❌ Erro ao carregar contatos:', error)
        alert('Erro ao carregar contatos. Verifique o console.')
      }
    }

    const editContato = (contato) => {
      console.log('✏️ Editando contato:', contato)
      editingContato.value = contato

      Object.assign(contatoForm, {
        id: contato.id,
        name: contato.name,
        email: contato.email,
        phone: contato.phone,
        cnpj: contato.cnpj,
        observations: contato.observations,
        address: {
          street: contato.address?.street || '',
          number: contato.address?.number || '',
          city: contato.address?.city || '',
          state: contato.address?.state || '',
          quarter: contato.address?.quarter || '',
          zipCode: contato.address?.zipCode || ''
        }
      })

      const offcanvasElement = document.getElementById('offcanvasNovoContato')
      const offcanvasInstance = Offcanvas.getOrCreateInstance(offcanvasElement)
      offcanvasInstance.show()
    }

    const saveContato = async () => {
      if (!validateContatoForm()) {
        return
      }

      try {
        if (editingContato.value) {
          const updateData = {
            name: contatoForm.name,
            email: contatoForm.email,
            phone: contatoForm.phone,
            cnpj: contatoForm.cnpj,
            observations: contatoForm.observations,
            address: { ...contatoForm.address }
          }

          await ContactService.updateContact(contatoForm.id, updateData)
          console.log('✅ Contato atualizado com sucesso!')
        } else {
          const newContactData = {
            name: contatoForm.name,
            email: contatoForm.email,
            phone: contatoForm.phone,
            cnpj: contatoForm.cnpj,
            observations: contatoForm.observations,
            address: { ...contatoForm.address }
          }

          await ContactService.createContact(newContactData)
          console.log('✅ Contato criado com sucesso!')
        }

        await loadContacts()
        closeOffcanvas()
        resetForm()
      } catch (error) {
        console.error('❌ Erro ao salvar contato:', error)
        try {
          const errorObj = JSON.parse(error.message)
          if (Array.isArray(errorObj)) {
            alert('Erro de validação:\n' + errorObj.join('\n'))
          } else if (errorObj.errors) {
            const errorMessages = Object.values(errorObj.errors).flat().join('\n')
            alert('Erro de validação:\n' + errorMessages)
          } else {
            alert('Erro ao salvar contato: ' + error.message)
          }
        } catch {
          alert('Erro ao salvar contato. Verifique o console.')
        }
      }
    }

    const resetForm = () => {
      Object.assign(contatoForm, {
        id: null,
        name: '',
        email: '',
        phone: '',
        cnpj: '',
        observations: '',
        address: {
          street: '',
          number: '',
          city: '',
          state: '',
          quarter: '',
          zipCode: ''
        }
      })
      editingContato.value = null
      contatoErrors.value = {}
    }

    const resetFormAndOpenOffcanvas = () => {
      resetForm()
    }

    const closeOffcanvas = () => {
      const offcanvasElement = document.getElementById('offcanvasNovoContato')
      const offcanvasInstance = Offcanvas.getInstance(offcanvasElement)
      if (offcanvasInstance) {
        offcanvasInstance.hide()
      }
    }

    onMounted(() => {
      loadContacts()
    })

    return {
      contatos,
      editingContato,
      contatoForm,
      contatoErrors,
      validateName,
      validateEmail,
      validatePhone,
      validateCnpj,
      validateAddressField,
      loadContacts,
      editContato,
      saveContato,
      resetFormAndOpenOffcanvas
    }
  }
}
</script>

<style scoped>
.contatos-page {
  padding: 0;
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
