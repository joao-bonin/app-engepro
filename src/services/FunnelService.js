const API_URL = 'http://localhost:9000/funnel' // Assumindo que o proxy está configurado para /api

// Função auxiliar para requisições com fetch (copiada do ProjectService para consistência)
const fetchApi = async (url, method = 'GET', data = null) => {
  const token = localStorage.getItem("token");
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json;charset=UTF-8',
    'Authorization': `Bearer ${token}`
  };

  const config = {
    method,
    headers,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(url, config);

  if (response.status === 422) {
    const errors = await response.json();
    throw new Error(JSON.stringify(errors));
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro na requisição: ${response.status} - ${errorText}`);
  }

  // Respostas DELETE e POST/PUT sem corpo
  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return { message: "Operação realizada com sucesso" };
  }
  
  return response.json();
};


const FunnelService = {
  // GET /funnel
  getAllFunnels: async () => {
    return fetchApi(API_URL);
  },

  // GET /funnel/{id}/steps
  getStepsByFunnelId: async (funnelId) => {
    return fetchApi(`${API_URL}/${funnelId}`);
  }
}

export default FunnelService
