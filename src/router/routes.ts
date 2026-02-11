import Home from '@/views/home/index.vue'
import Login from '@/views/login/index.vue'
import AdminLayout from '@/layout/admin/layout.vue'
import AdminEditorLayout from '@/layout/admin/editor.layout.vue'
import HomeLayout from '@/layout/home.layout.vue';
import AppLayout from '@/layout/app.layout.vue';
export const routes = [
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
                    {
                        path: 'article/:slug',
                        component: () => import('@/views/article/detail.vue'),
                        name: 'ArticleDetail',
                        props: true
                    },
                    {
                        path: 'friend-link',
                        component: () => import('@/views/link/FriendLink.vue'),
                        name: 'FriendLink'
                    },
                    { path: 'about', component: () => import('@/views/about/index.vue'), name: 'About' }
                ],
            },
            {
                path: '/admin', component: AdminLayout, name: 'Admin',
                meta: { requiresAuth: true, requiresAdmin: true },
                children: [
                    { path: 'user', component: () => import('@/views/admin/user/index.vue'), name: 'AdminUserList' },
                    {
                        path: 'article',
                        component: () => import('@/views/admin/article/index.vue'),
                        name: 'AdminArticleList',
                    },
                    {
                        path: 'friend-link',
                        component: () => import('@/views/admin/link/FriendLink.vue'),
                        name: 'AdminFriendLinkList',
                    }
                ]
            },
            {
                path: "/me",
                meta: { requiresAuth: true },
                component: () => import('@/layout/me/index.vue'),
                children: [
                    { path: "base", name: "MeBase", component: () => import("@/views/me/base.vue") },
                    { path: "security", name: "MeSecurity", component: () => import("@/views/me/security.vue") },
                ]
            },
            {
                path: "/admin",
                component: AdminEditorLayout,
                meta: { requiresAuth: true, requiresAdmin: true },
                children: [
                    { path: "article/new", name: "AdminArticleCreate", component: () => import("@/views/admin/article/editor.vue") },
                    { path: "article/edit/:id", name: "AdminArticleEdit", component: () => import("@/views/admin/article/editor.vue"), props: true },
                ],
            }
        ],
    },
    { path: '/login', component: Login, name: 'Login' },
    { path: '/register', component: () => import('@/views/login/register.vue'), name: 'Register' },
]