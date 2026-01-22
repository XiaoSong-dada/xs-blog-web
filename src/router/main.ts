import { createWebHistory, createRouter } from 'vue-router'

import Home from '../views/home/index.vue'
import Index from '../views/index.vue'
import Center from '../views/center/index.vue'
import Login from '../views/login/index.vue'
import { isLogin } from '../utils/utils'

const routes = [
    {
        path: '/',
        component: Index,
        children: [
            { path: '', component: Home, name: 'Home' },
            { path: 'center', component: Center, name: 'Center' }
        ],
    },
    { path: '/login', component: Login, name: 'Login' },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to) => {
   if (
     // 检查用户是否已登录
     !isLogin() &&
     // ❗️ 避免无限重定向
     to.name !== 'Login'
   ) {
     // 将用户重定向到登录页面
     return { name: 'Login' }
   }
 })

export default router
