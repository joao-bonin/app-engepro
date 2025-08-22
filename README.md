# EngePro - Sistema de Gestão Integrada

## Descrição
Sistema de gestão integrada para projetos de engenharia e construção, desenvolvido em Vue.js 3 com design responsivo e interface moderna.

## Estrutura do Projeto

### Organização de Arquivos
```
src/
├── assets/
│   ├── css/
│   │   ├── main.css          # Estilos principais e variáveis CSS
│   │   ├── sidebar.css       # Estilos do menu lateral
│   │   └── kanban.css        # Estilos do sistema Kanban
│   └── images/               # Imagens e assets
├── components/
│   ├── layout/
│   │   ├── Layout.vue        # Componente principal de layout
│   │   ├── Sidebar.vue       # Menu lateral de navegação
│   │   └── Topbar.vue        # Barra superior com usuário
│   └── kanban/
│       ├── KanbanBoard.vue   # Quadro Kanban principal
│       ├── KanbanColumn.vue  # Colunas do Kanban
│       └── KanbanCard.vue    # Cards de projetos
├── views/
│   ├── Projetos.vue          # Gestão de projetos (Kanban)
│   ├── FunisEtapas.vue       # Gestão de funis e etapas
│   ├── Usuarios.vue          # Gestão de usuários
│   └── Relatorios.vue        # Relatórios e dashboards
├── router/
│   └── index.js              # Configuração de rotas
├── App.vue                   # Componente raiz
└── main.js                   # Ponto de entrada da aplicação
```

## Funcionalidades Implementadas

### 1. Gestão de Projetos (Kanban)
- Quadro Kanban interativo com drag & drop
- Organização por funis e etapas
- Cards de projetos com informações detalhadas
- Modal para criação/edição de projetos

### 2. Gestão de Funis e Etapas
- Criação e edição de funis personalizados
- Gerenciamento de etapas com ordenação
- Interface accordion para organização

### 4. Gestão de Usuários
- Cadastro de usuários com perfis
- Controle de status (ativo/inativo)
- Diferentes níveis de acesso

### 5. Relatórios e Dashboard
- Cards de estatísticas em tempo real
- Gráficos interativos (Chart.js)
- Filtros por período, funil e status
- Tabela de projetos recentes

## Tecnologias Utilizadas

- **Vue.js 3** - Framework JavaScript reativo
- **Vue Router 4** - Roteamento SPA
- **Bootstrap 5** - Framework CSS responsivo
- **Bootstrap Icons** - Ícones vetoriais
- **Chart.js** - Biblioteca de gráficos
- **CSS Custom Properties** - Variáveis CSS para temas

## Melhorias Implementadas

### Arquitetura
- Separação clara de responsabilidades
- Componentes reutilizáveis e modulares
- CSS organizado em arquivos temáticos
- Roteamento SPA para melhor UX

### Design e UX
- Interface responsiva para desktop e mobile
- Tema consistente com variáveis CSS
- Animações e transições suaves
- Feedback visual para interações

### Performance
- Lazy loading de componentes
- Otimização de assets
- Código modular e reutilizável

## Como Executar

### Pré-requisitos
- Node.js 14+ 
- npm ou yarn

### Instalação
```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run serve

# Build para produção
npm run build
```

### Acesso
- **Desenvolvimento**: http://localhost:8080
- **Usuário padrão**: João Bonin

## Estrutura de Dados

### Projetos
- ID, nome, cliente, descrição
- Funil e etapa atual
- Datas de início e prazo
- Status e progresso

### Funis e Etapas
- Funis personalizáveis
- Etapas ordenadas por sequência
- Relacionamento com projetos

### Usuários
- Dados pessoais e de acesso
- Perfis de permissão
- Controle de status

## Próximos Passos

1. **Backend Integration**: Conectar com API REST
2. **Autenticação**: Sistema de login/logout
3. **Permissões**: Controle granular por perfil
4. **Notificações**: Sistema de alertas
5. **Relatórios Avançados**: Mais opções de filtros e exportação
6. **Mobile App**: Versão nativa para dispositivos móveis

## Contribuição

Para contribuir com o projeto:
1. Fork o repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## Licença

Este projeto está sob licença MIT. Veja o arquivo LICENSE para mais detalhes.

