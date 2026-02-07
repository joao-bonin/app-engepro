const API_URL = 'http://localhost:9000/contact'

const fetchApi = async (url, method = 'GET', data = null) => {
  const token = localStorage.getItem('token')
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=UTF-8',
    Authorization: `Bearer ${token}`
  }

  const config = {
    method,
    headers
  }

  if (data) {
    config.body = JSON.stringify(data)
  }

  const response = await fetch(url, config)

  if (response.status === 422) {
    const errors = await response.json()
    throw new Error(JSON.stringify(errors))
  }

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Erro na requisição: ${response.status} - ${errorText}`)
  }

  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return { message: 'Operação realizada com sucesso' }
  }

  return response.json()
}

const ContactService = {
  getAllContacts: async () => {
    return fetchApi(API_URL)
  },

  createContact: async (contactData) => {
    return fetchApi(API_URL, 'POST', contactData)
  },

  updateContact: async (contactId, contactData) => {
    return fetchApi(`${API_URL}/${contactId}`, 'PUT', contactData)
  }
}

export default ContactService
