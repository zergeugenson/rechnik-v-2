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
      ]
    },
  ]
});

router.beforeEach(async (to) => {

});

export default router;
