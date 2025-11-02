const API_URL = 'http://localhost:9000/project' // Assumindo que o proxy está configurado para /api

// Função auxiliar para requisições com fetch
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

const ProjectService = {
  // 1. Carregar Projetos por Funil (para o Kanban)
  // GET /project/funnel/{id}
  getProjectsByFunnelId: async (funnelId) => {
    return fetchApi(`${API_URL}/funnel/${funnelId}`);
  },

  // 2. Criar Novo Projeto
  // POST /project
  createProject: async (projectData) => {
    // Formata as datas para o padrão ISO 8601 exigido pelo backend (yyyy-MM-dd'T'HH:mm:ss)
    const formattedData = {
      ...projectData,
      startDate: projectData.startDate ? new Date(projectData.startDate).toISOString().slice(0, 19) : null,
      endDate: projectData.endDate ? new Date(projectData.endDate).toISOString().slice(0, 19) : null,
      isArchived: false // Novo projeto nunca é arquivado
    };
    return fetchApi(API_URL, 'POST', formattedData);
  },

  // 3. Atualizar Projeto
  // PUT /project/{id}
  updateProject: async (projectId, projectData) => {
    // Formata as datas para o padrão ISO 8601 exigido pelo backend
    const formattedData = {
      ...projectData,
      startDate: projectData.startDate ? new Date(projectData.startDate).toISOString().slice(0, 19) : null,
      endDate: projectData.endDate ? new Date(projectData.endDate).toISOString().slice(0, 19) : null,
    };
    return fetchApi(`${API_URL}/${projectId}`, 'PUT', formattedData);
  },

  // 4. Mover Projeto (Atualizar apenas a Etapa - stepId)
  // Reutiliza a rota de update, mas envia o DTO completo com o novo stepId
  moveProjectStage: async (projectId, newStepId, currentProjectData) => {
    const dataToUpdate = {
      ...currentProjectData,
      stepId: newStepId
    };
    return ProjectService.updateProject(projectId, dataToUpdate);
  },

  // 5. Arquivar Projeto (O delete do backend na verdade arquiva)
  // DELETE /project/{id}
  archiveProject: async (projectId) => {
    return fetchApi(`${API_URL}/${projectId}`, 'DELETE');
  }
}

export default ProjectService;
