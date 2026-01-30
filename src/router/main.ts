import { createWebHistory, createRouter } from 'vue-router'
import { AuthService } from '@/service/auth.service';
import { routes } from '@/router/routes';
import { message } from 'ant-design-vue';

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(
        record => record.meta.requiresAuth
    );

    const requiresAdmin = to.matched.some(
        record => record.meta.requiresAdmin
    );

    // 需要登录，但没登录
    if (requiresAuth && !AuthService.isLogin()) {
        message.info('请登录后使用该功能')
        next({
            path: "/login",
            query: { redirect: to.fullPath }
        });
        return;
    }

    // 需要管理员，但不是管理员
    if (requiresAdmin && !AuthService.isAdmin()) {
        message.info('无权限访问！')
        return;
    }

    // 放行
    next();
});


export default router
