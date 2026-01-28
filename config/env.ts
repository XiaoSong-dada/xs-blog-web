const apiUrl = import.meta.env.VITE_BACKEND_API_URL;

export const config = {
    // Add your environment variables here
    TOKEN_KEY: 'blog_token',
    PROXY_URL: apiUrl,
    TIMEOUT: 20000,
    PROXY_NAME:'/api'
}
