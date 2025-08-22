<template>
  <div class="relatorios-page">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="page-title mb-0">Relatório de Desempenho</h2>
      <div>
        <button class="btn btn-outline-secondary me-2">
          <i class="bi bi-printer me-2"></i>Imprimir
        </button>
        <button class="btn btn-primary-custom">
          <i class="bi bi-download me-2"></i>Exportar PDF
        </button>
      </div>
    </div>
    
    <!-- Filtros -->
    <div class="report-filters">
      <div class="row g-3">
        <div class="col-md-3">
          <label class="form-label">Período</label>
          <select class="form-select" v-model="filters.periodo">
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 90 dias</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Funil</label>
          <select class="form-select" v-model="filters.funil">
            <option value="">Todos os Funis</option>
            <option value="construcao">Construção</option>
            <option value="desenvolvimento">Desenvolvimento</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Status</label>
          <select class="form-select" v-model="filters.status">
            <option value="">Todos os Status</option>
            <option value="ativo">Ativo</option>
            <option value="concluido">Concluído</option>
            <option value="atrasado">Atrasado</option>
          </select>
        </div>
        <div class="col-md-3 d-flex align-items-end">
          <button class="btn btn-primary-custom w-100" @click="applyFilters">
            <i class="bi bi-filter me-2"></i>Aplicar Filtros
          </button>
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
                <div class="stat-label">Projetos Concluídos</div>
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
                <div class="stat-label">Projetos Atrasados</div>
              </div>
              <div class="stat-icon">
                <i class="bi bi-exclamation-triangle"></i>
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
          <div class="card-header card-header-custom">Projetos por Etapa</div>
          <div class="card-body">
            <div class="chart-container">
              <canvas ref="projetosPorEtapaChart"></canvas>
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
      <div class="card-header card-header-custom">Projetos Recentes</div>
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
              <tr v-for="projeto in projetosRecentes" :key="projeto.id">
                <td>{{ projeto.nome }}</td>
                <td>{{ projeto.etapa }}</td>
                <td>
                  <div class="progress" style="height: 20px;">
                    <div 
                      class="progress-bar" 
                      role="progressbar" 
                      :style="{ width: projeto.progresso + '%' }"
                      :aria-valuenow="projeto.progresso" 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    >
                      {{ projeto.progresso }}%
                    </div>
                  </div>
                </td>
                <td>
                  <span 
                    class="badge" 
                    :class="getStatusClass(projeto.status)"
                  >
                    {{ projeto.status }}
                  </span>
                </td>
                <td>{{ projeto.prazo }}</td>
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

export default {
  name: 'Relatorios',
  setup() {
    const projetosPorEtapaChart = ref(null)
    const statusDistribuicaoChart = ref(null)
    
    const filters = reactive({
      periodo: '7',
      funil: '',
      status: ''
    })
    
    const stats = reactive({
      totalProjetos: 24,
      projetosConcluidos: 8,
      projetosAndamento: 14,
      projetosAtrasados: 2
    })
    
    const projetosRecentes = ref([
      {
        id: 1,
        nome: 'Residencial XYZ',
        etapa: 'Execução',
        progresso: 75,
        status: 'Em dia',
        prazo: '30/07/2025'
      },
      {
        id: 2,
        nome: 'Comercial ABC',
        etapa: 'Planejamento',
        progresso: 25,
        status: 'Em dia',
        prazo: '15/08/2025'
      },
      {
        id: 3,
        nome: 'Industrial DEF',
        etapa: 'Fundação',
        progresso: 50,
        status: 'Atrasado',
        prazo: '10/07/2025'
      }
    ])
    
    let chartProjetosEtapa = null
    let chartStatusDistribuicao = null
    
    const getStatusClass = (status) => {
      switch (status) {
        case 'Em dia':
          return 'bg-success'
        case 'Atrasado':
          return 'bg-danger'
        case 'Atenção':
          return 'bg-warning'
        case 'Concluído':
          return 'bg-secondary'
        default:
          return 'bg-primary'
      }
    }
    
    const applyFilters = () => {
      console.log('Aplicando filtros:', filters)
      // Implementar lógica de filtros
      loadCharts()
    }
    
    const loadCharts = async () => {
      await nextTick()
      
      // Importar Chart.js dinamicamente
      const Chart = (await import('chart.js/auto')).default
      
      // Destruir gráficos existentes
      if (chartProjetosEtapa) {
        chartProjetosEtapa.destroy()
      }
      if (chartStatusDistribuicao) {
        chartStatusDistribuicao.destroy()
      }
      
      // Gráfico de Projetos por Etapa
      if (projetosPorEtapaChart.value) {
        const ctx1 = projetosPorEtapaChart.value.getContext('2d')
        chartProjetosEtapa = new Chart(ctx1, {
          type: 'bar',
          data: {
            labels: ['Planejamento', 'Fundação', 'Estrutura', 'Alvenaria', 'Acabamento'],
            datasets: [{
              label: 'Nº de Projetos',
              data: [6, 4, 3, 5, 6],
              backgroundColor: 'rgba(52, 152, 219, 0.7)',
              borderColor: 'rgba(52, 152, 219, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  precision: 0
                }
              }
            },
            plugins: {
              legend: {
                display: false
              }
            }
          }
        })
      }
      
      // Gráfico de Distribuição por Status
      if (statusDistribuicaoChart.value) {
        const ctx2 = statusDistribuicaoChart.value.getContext('2d')
        chartStatusDistribuicao = new Chart(ctx2, {
          type: 'doughnut',
          data: {
            labels: ['Em dia', 'Atenção', 'Atrasado', 'Concluído'],
            datasets: [{
              data: [12, 2, 2, 8],
              backgroundColor: [
                'rgba(46, 204, 113, 0.7)',
                'rgba(241, 196, 15, 0.7)',
                'rgba(231, 76, 60, 0.7)',
                'rgba(52, 73, 94, 0.7)'
              ],
              borderWidth: 2,
              borderColor: '#fff'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom'
              }
            }
          }
        })
      }
    }
    
    onMounted(() => {
      loadCharts()
    })
    
    return {
      projetosPorEtapaChart,
      statusDistribuicaoChart,
      filters,
      stats,
      projetosRecentes,
      getStatusClass,
      applyFilters
    }
  }
}
</script>

<style scoped>
.relatorios-page {
  padding: 0;
}

.report-filters {
  background-color: var(--light-bg);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 2rem;
  opacity: 0.8;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
}

.stat-label {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}

.progress {
  background-color: #e9ecef;
}

.progress-bar {
  background-color: var(--accent-color);
}
</style>

