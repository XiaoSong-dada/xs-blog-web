const apiUrl = import.meta.env.VITE_BACKEND_API_URL;

const config = {
    // Add your environment variables here
    TOKEN_KEY: 'token',
    baseURL: apiUrl,
    TIMEOUT: 20000
}
export default config
