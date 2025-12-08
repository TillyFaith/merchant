import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import ChatView from '@/views/ChatView.vue'
import KnowledgeManagementView from '@/views/KnowledgeManagementView.vue'
import KnowledgeDetailView from '@/views/KnowledgeDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/chat',
      name: 'chat',
      component: ChatView,
    },
    {
      path: '/knowledge',
      name: 'knowledge',
      component: KnowledgeManagementView,
    },
    {
      path: '/knowledge/:id',
      name: 'knowledge-detail-view',
      component: KnowledgeDetailView,
      props: true, // 启用props传参，方便组件接收id参数
    },
    {
      path: '/visualization',
      name: 'visualize',
      component: () => import('@/views/VisualizeView.vue'),
    },
  ],
})

export default router
