<template>
  <div class="relatorios-page">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="page-title mb-0">Relatório de Desempenho</h2>
      <button class="btn btn-primary-custom" @click="fetchReportData">
        <i class="bi bi-arrow-clockwise me-2"></i>Atualizar Dados
      </button>
    </div>

    <div class="report-filters">
      <div class="row">
        <div class="col-md-4">
          <label for="selectReportFunnel" class="form-label"><strong>Funil:</strong></label>
          <select
            id="selectReportFunnel"
            class="form-select"
            v-model="selectedFunnelId"
            @change="fetchReportData"
          >
            <option :value="null">Todos</option>
            <option v-for="funil in funnels" :key="funil.id" :value="funil.id">
              {{ funil.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Cards de Estatísticas -->
    <div class="row mb-4">
      <div class="col-md-3 mb-3">
        <div class="card stat-card h-100 bg-primary text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <div class="stat-value">{{ stats.totalProjetos }}</div>
                <div class="stat-label">Total de Projetos</div>
              </div>
              <div class="stat-icon">
                <i class="bi bi-folder"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-3 mb-3">
        <div class="card stat-card h-100 bg-success text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <div class="stat-value">{{ stats.projetosConcluidos }}</div>
                <div class="stat-label">Concluídos</div>
              </div>
              <div class="stat-icon">
                <i class="bi bi-check-circle"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-3 mb-3">
        <div class="card stat-card h-100 bg-warning text-dark">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <div class="stat-value">{{ stats.projetosAndamento }}</div>
                <div class="stat-label">Em Andamento</div>
              </div>
              <div class="stat-icon">
                <i class="bi bi-clock-history"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-3 mb-3">
        <div class="card stat-card h-100 bg-danger text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <div class="stat-value">{{ stats.projetosAtrasados }}</div>
                <div class="stat-label">Atrasados</div>
              </div>
              <div class="stat-icon">
                <i class="bi bi-exclamation-triangle"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3 mb-3">
        <div class="card stat-card h-100 bg-secondary text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <div class="stat-value">{{ stats.projetosArquivados }}</div>
                <div class="stat-label">Arquivados</div>
              </div>
              <div class="stat-icon">
                <i class="bi bi-archive"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Gráficos -->
    <div class="row mb-4">
      <div class="col-md-8 mb-3">
        <div class="card card-custom h-100">
          <div class="card-header card-header-custom">Projetos por Funil</div>
          <div class="card-body">
            <div class="chart-container">
              <canvas ref="projetosPorFunilChart"></canvas>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-4 mb-3">
        <div class="card card-custom h-100">
          <div class="card-header card-header-custom">Distribuição por Status</div>
          <div class="card-body">
            <div class="chart-container">
              <canvas ref="statusDistribuicaoChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Tabela de Projetos Recentes -->
    <div class="card card-custom mb-4">
      <div class="card-header card-header-custom">Análise Detalhada de Projetos</div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th>Projeto</th>
                <th>Etapa</th>
                <th>Progresso</th>
                <th>Status</th>
                <th>Prazo</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="projeto in projects" :key="projeto.id">
                <td>
                  <strong>{{ projeto.name }}</strong><br>
                  <small class="text-muted">{{ projeto.customer }}</small>
                </td>
                <td>{{ projeto.stepName }}</td>
                <td style="width: 200px;">
                  <div class="progress" style="height: 10px;">
                    <div 
                      class="progress-bar" 
                      role="progressbar" 
                      :style="{ width: projeto.progress + '%' }"
                      :class="projeto.progress === 100 ? 'bg-success' : ''"
                    ></div>
                  </div>
                  <small>{{ projeto.progress }}%</small>
                </td>
                <td>
                  <span class="badge" :class="getStatusBadgeClass(projeto.status)">
                    {{ projeto.status }}
                  </span>
                </td>
                <td>{{ formatDate(projeto.endDate) }}</td>
              </tr>
              <tr v-if="projects.length === 0">
                <td colspan="5" class="text-center py-4">Nenhum dado disponível.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, nextTick } from 'vue'
import FunnelService from '../services/FunnelService'

export default {
  name: 'Relatorios',
  setup() {
    const projetosPorFunilChart = ref(null)
    const statusDistribuicaoChart = ref(null)
    const projects = ref([])
    const funnels = ref([])
    const selectedFunnelId = ref(null)
    
    const stats = reactive({
      totalProjetos: 0,
      projetosConcluidos: 0,
      projetosAndamento: 0,
      projetosAtrasados: 0,
      projetosArquivados: 0
    })
    
    let chartProjetosFunil = null
    let chartStatusDistribuicao = null

    const getStatusBadgeClass = (status) => {
      switch (status) {
        case 'Em dia': return 'bg-success'
        case 'Atrasado': return 'bg-danger'
        case 'Atenção': return 'bg-warning text-dark'
        case 'Concluído': return 'bg-info'
        case 'Arquivado': return 'bg-secondary'
        default: return 'bg-primary'
      }
    }

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString('pt-BR')
    }

    const loadFunnels = async () => {
      try {
        const data = await FunnelService.getAllFunnels()
        funnels.value = data.filter(funnel => funnel.steps.length > 0)
      } catch (error) {
        console.error('Erro ao carregar funis:', error)
      }
    }

    const fetchReportData = async () => {
      try {
        const token = localStorage.getItem("token");
        const url = new URL('http://localhost:9000/report')
        url.searchParams.set('funnelId', selectedFunnelId.value ?? 'null')
        const response = await fetch(url.toString(), {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await response.json()
        projects.value = data.projects

        // Calcular estatísticas baseadas nos novos status
        stats.totalProjetos = data.projects.length
        stats.projetosConcluidos = data.projects.filter(p => p.status === 'Concluído').length
        stats.projetosAtrasados = data.projects.filter(p => p.status === 'Atrasado').length
        stats.projetosAndamento = data.projects.filter(p => p.status === 'Em dia' || p.status === 'Atenção').length
        stats.projetosArquivados = data.projects.filter(p => p.status === 'Arquivado').length

        loadCharts(data.projects)
      } catch (error) {
        console.error('Erro ao carregar relatório:', error)
      }
    }
    
    const loadCharts = async (projectList) => {
      await nextTick()
      const Chart = (await import('chart.js/auto')).default
      
      if (chartProjetosFunil) chartProjetosFunil.destroy()
      if (chartStatusDistribuicao) chartStatusDistribuicao.destroy()
      
      // Dados para Projetos por Funil
      const funnels = [...new Set(projectList.map(p => p.funnelName).filter(Boolean))]
      const funnelCounts = funnels.map(f => projectList.filter(p => p.funnelName === f).length)

      if (projetosPorFunilChart.value) {
        chartProjetosFunil = new Chart(projetosPorFunilChart.value.getContext('2d'), {
          type: 'bar',
          data: {
            labels: funnels,
            datasets: [{
              label: 'Nº de Projetos',
              data: funnelCounts,
              backgroundColor: 'rgba(52, 152, 219, 0.7)',
              borderColor: 'rgba(52, 152, 219, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
            plugins: { legend: { display: false } }
          }
        })
      }
      
      // Dados para Distribuição por Status
      const statusCounts = {
        'Em dia': projectList.filter(p => p.status === 'Em dia').length,
        'Atenção': projectList.filter(p => p.status === 'Atenção').length,
        'Atrasado': projectList.filter(p => p.status === 'Atrasado').length,
        'Concluído': projectList.filter(p => p.status === 'Concluído').length,
        'Arquivado': projectList.filter(p => p.status === 'Arquivado').length
      }

      if (statusDistribuicaoChart.value) {
        chartStatusDistribuicao = new Chart(statusDistribuicaoChart.value.getContext('2d'), {
          type: 'doughnut',
          data: {
            labels: ['Em dia', 'Atenção', 'Atrasado', 'Concluído', 'Arquivado'],
            datasets: [{
              data: [
                statusCounts['Em dia'],
                statusCounts['Atenção'],
                statusCounts['Atrasado'],
                statusCounts['Concluído'],
                statusCounts['Arquivado']
              ],
              backgroundColor: [
                'rgba(46, 204, 113, 0.7)',
                'rgba(241, 196, 15, 0.7)',
                'rgba(231, 76, 60, 0.7)',
                'rgba(52, 152, 219, 0.7)',
                'rgba(149, 165, 166, 0.7)'
              ],
              borderWidth: 2,
              borderColor: '#fff'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } }
          }
        })
      }
    }
    
    onMounted(() => {
      loadFunnels()
      fetchReportData()
    })
    
    return {
      projetosPorFunilChart,
      statusDistribuicaoChart,
      funnels,
      selectedFunnelId,
      stats,
      projects,
      getStatusBadgeClass,
      formatDate,
      fetchReportData
    }
  }
}
</script>

<style scoped>
.relatorios-page { padding: 0; }
.stat-card { border-radius: 0.5rem; transition: transform 0.3s; }
.stat-card:hover { transform: translateY(-5px); }
.stat-icon { font-size: 2rem; opacity: 0.8; }
.stat-value { font-size: 2rem; font-weight: 700; }
.stat-label { font-size: 0.9rem; text-transform: uppercase; }
.chart-container { position: relative; height: 300px; width: 100%; }
.progress { background-color: #e9ecef; border-radius: 5px; }
.progress-bar { background-color: #3498db; }
</style>
