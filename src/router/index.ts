import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '/',
          name: 'Dash',
          component: () => import('@/views/Cards.vue')
        },
        {
          path: '/grammar',
          name: 'Grammar',
          component: () => import('@/views/Grammar.vue')
        }
      ]
    },
  ]
});

router.beforeEach(async (to) => {

});

export default router;
