import { createWebHistory, createRouter } from 'vue-router'

import Home from '../views/home/index.vue'
import Index from '../views/index.vue'
import Center from '../views/center/index.vue'
import Login from '../views/login/index.vue'

const routes = [
    {
        path: '/',
        component: Index,
        children: [
            { path: '', component: Home, name: 'Home' },
            { path: 'article', component: () => import('../views/article/index.vue'), name: 'Article' },
            { path: 'about', component: () => import('../views/about/index.vue'), name: 'About' },
            { path: 'center', component: Center, name: 'Center' }
        ],
    },
    { path: '/login', component: Login, name: 'Login' },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
