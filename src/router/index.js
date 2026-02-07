// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/services/auth'

// Login fora do layout
import LoginIsolated from '@/views/LoginIsolated.vue'

// Lazy load do Layout (code-splitting)
const Layout = () => import('@/components/layout/Layout.vue')

// Views herdadas do projeto (ajuste nomes conforme existirem no repo)
const Projetos = () => import('@/views/Projetos.vue')
const FunisEtapas = () => import('@/views/FunisEtapas.vue')
const Usuarios = () => import('@/views/Usuarios.vue')
const Contatos = () => import('@/views/Contatos.vue')
const Relatorios = () => import('@/views/Relatorios.vue')

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    // Rota isolada (sem layout)
    { path: '/login', name: 'Login', component: LoginIsolated },

    // Rotas protegidas que "herdam" funcionalidades do projeto via layout
    {
      path: '/',
      component: Layout,
      meta: { requiresAuth: true },
      children: [
        { path: 'projetos', name: 'Projetos', component: Projetos },
        { path: 'funis-etapas', name: 'FunisEtapas', component: FunisEtapas },
        { path: 'contatos', name: 'Contatos', component: Contatos },
        { path: 'usuarios', name: 'Usuarios', component: Usuarios },
        { path: '', name: 'Relatorios', component: Relatorios }
      ]
    },

    // fallback
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})

// Guarda de rota: exige login nas rotas com meta.requiresAuth
router.beforeEach((to, from, next) => {
  // const logged = isAuthenticated();
  const logged = isAuthenticated();
  if (to.matched.some(r => r.meta.requiresAuth) && !logged) {
    next({ path: '/login' });
  } else if (to.path === '/login' && logged) {
    next({ path: '/' });
  } else {
    next();
  }
});


export default router
