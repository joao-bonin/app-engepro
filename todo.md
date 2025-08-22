# Organização do Projeto EngePro

## Fase 3: Reorganizar arquivos seguindo boas práticas

### Tarefas a realizar:
- [x] Analisar estrutura atual do projeto Vue.js
- [x] Extrair CSS do arquivo HTML para arquivos separados
- [x] Criar componentes Vue.js modulares
- [x] Organizar assets (imagens, ícones)
- [x] Configurar roteamento para as diferentes seções
- [x] Implementar responsividade
- [x] Testar funcionalidades
- [x] Documentar estrutura final

### Estrutura proposta:
```
src/
├── assets/
│   ├── css/
│   │   ├── main.css
│   │   ├── sidebar.css
│   │   ├── kanban.css
│   │   └── components.css
│   └── images/
├── components/
│   ├── layout/
│   │   ├── Sidebar.vue
│   │   ├── Topbar.vue
│   │   └── Layout.vue
│   ├── kanban/
│   │   ├── KanbanBoard.vue
│   │   ├── KanbanColumn.vue
│   │   └── KanbanCard.vue
│   ├── modals/
│   │   ├── NovoProjetoModal.vue
│   │   ├── NovoUsuarioModal.vue
│   └── charts/
│       └── ReportCharts.vue
├── views/
│   ├── Projetos.vue
│   ├── FunisEtapas.vue
│   ├── Usuarios.vue
│   └── Relatorios.vue
├── router/
│   └── index.js
└── App.vue
```

