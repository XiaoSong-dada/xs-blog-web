import { createWebHistory, createRouter } from 'vue-router'

import Home from '@/views/home/index.vue'
import Login from '@/views/login/index.vue'
import AdminLayout from '@/layout/admin/layout.vue'
import AdminEditorLayout from '@/layout/admin/editor.layout.vue'
import HomeLayout from '@/layout/home.layout.vue';
import AppLayout from '@/layout/app.layout.vue';

const routes = [
    {
        path: '/',
        component: AppLayout,
        children: [
            {
                path: '/',
                component: HomeLayout,
                children: [
                    { path: '', component: Home, name: 'Home' },
                    { path: 'article', component: () => import('@/views/article/index.vue'), name: 'Article' },
                    { path: 'about', component: () => import('@/views/about/index.vue'), name: 'About' }
                ],
            },
            {
                path: '/admin', component: AdminLayout, name: 'Admin',
                children: [
                    { path: 'user', component: () => import('@/views/admin/user/index.vue'), name: 'AdminUserList' },
                    { path: 'article', component: () => import('@/views/admin/article/index.vue'), name: 'AdminArticleList' },
                ]
            },
            {
                path: '/admin', component: AdminEditorLayout, name: 'Editor',
                children: [
                    { path: 'article/new', component: () => import('@/views/admin/article/new.vue'), name: 'AdminEditor' },
                ]
            },


        ],
    },
    { path: '/login', component: Login, name: 'Login' },

]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
