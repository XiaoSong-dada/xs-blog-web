export const config = {
    // Add your environment variables here
    TOKEN_KEY: 'blog_token',
    PROXY_URL: 'http://localhost:8000/api',
    TIMEOUT: 20000,
    PROXY_NAME:'/api',
    VITE_STATIC_URL: import.meta.env.VITE_STATIC_URL ?? 'http://localhost:8000/static/',
    VITE_VDITOR_CDN: import.meta.env.VITE_VDITOR_CDN ?? '/vditor',
    VITE_SITE_ICP: import.meta.env.VITE_SITE_ICP ?? '',
    VITE_SITE_ICP_LINK: import.meta.env.VITE_SITE_ICP_LINK ?? '',
    VITE_SITE_NAME: import.meta.env.VITE_SITE_NAME ?? 'My Blog',
    VITE_GITHUB_REPO: import.meta.env.VITE_GITHUB_REPO ?? '小宋哒哒',
    VITE_GITHUB_REPO_URL: import.meta.env.VITE_GITHUB_REPO_URL ?? '#',
    VITE_BACKEND_BASE_URL: import.meta.env.VITE_BACKEND_BASE_URL ?? '',
    VITE_BACKEND_STATIC: import.meta.env.VITE_BACKEND_STATIC ?? 'static',
}

export default config