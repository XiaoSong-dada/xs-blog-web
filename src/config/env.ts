export const config = {
    // Add your environment variables here
    TOKEN_KEY: 'blog_token',
    PROXY_URL: 'http://localhost:8000/api',
    TIMEOUT: 20000,
    PROXY_NAME:'/api',
    VITE_STATIC_URL: import.meta.env.VITE_STATIC_URL ?? 'http://localhost:8000/static/',
    VITE_VDITOR_CDN: import.meta.env.VITE_VDITOR_CDN ?? '/vditor'
}
