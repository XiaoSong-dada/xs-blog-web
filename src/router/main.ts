import { createWebHistory, createRouter } from 'vue-router'

import Home from '../views/home/index.vue'
import Index from '../views/index.vue'
import Login from '../views/login/index.vue'

const routes = [
    {
        path: '/',
        component: Index,
        children: [
            { path: '', component: Home, name: 'Home' },
            { path: 'article', component: () => import('../views/article/index.vue'), name: 'Article' },
            { path: 'about', component: () => import('../views/about/index.vue'), name: 'About' },
            {
                path: 'center',
                component: () => import('../views/center/index.vue'),
                name: 'Center',
                children: [
                    { path: 'user', component: () => import('../views/center/user/index.vue'), name: 'User' },
                    { path: 'article', component: () => import('../views/center/article/index.vue'), name: 'CenterArticle' },
                ]
            }
        ],
    },
    { path: '/login', component: Login, name: 'Login' },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
