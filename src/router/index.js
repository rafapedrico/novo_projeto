import { createRouter, createWebHistory } from 'vue-router'
import { store } from '../store.js'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
  },
  {
    path: '/configuracao',
    name: 'Configuracao',
    component: () => import('../views/ConfiguradorView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/inspecao',
    name: 'Inspecao',
    component: () => import('../views/InspecaoView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/rnc',
    name: 'Rnc',
    component: () => import('../views/RncView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/finalizado',
    name: 'Finalizado',
    component: () => import('../views/FinalizadoView.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.usuarioLogado.nome) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
