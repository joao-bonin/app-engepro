import { createRouter, createWebHistory } from 'vue-router'
import Projetos from '../views/Projetos.vue'
import FunisEtapas from '../views/FunisEtapas.vue'

const routes = [
  {
    path: '/',
    redirect: '/projetos'
  },
  {
    path: '/projetos',
    name: 'Projetos',
    component: Projetos
  },
  {
    path: '/funis-etapas',
    name: 'FunisEtapas',
    component: FunisEtapas
  },
  {
    path: '/usuarios',
    name: 'Usuarios',
    component: () => import('../views/Usuarios.vue')
  },
  {
    path: '/relatorios',
    name: 'Relatorios',
    component: () => import('../views/Relatorios.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

