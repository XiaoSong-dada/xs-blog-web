const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '')

const deriveApiRequestMode = () => {
    const configuredMode = import.meta.env.VITE_API_REQUEST_MODE
    if (configuredMode === 'proxy' || configuredMode === 'direct') {
        return configuredMode
    }
    return import.meta.env.PROD ? 'proxy' : 'direct'
}

const directApiUrl = trimTrailingSlash(import.meta.env.VITE_BACKEND_API_URL ?? 'http://localhost:8000/api')
const apiRequestMode = deriveApiRequestMode()
const derivedBackendBaseUrl = directApiUrl.replace(/\/api$/, '')

export const config = {
    TOKEN_KEY: 'xs_blog_token',
    PROXY_URL: '/api',
    TIMEOUT: 20000,
    VITE_API_REQUEST_MODE: apiRequestMode,
    VITE_BACKEND_API_URL: apiRequestMode === 'proxy' ? '/api' : directApiUrl,
    VITE_STATIC_URL: import.meta.env.VITE_STATIC_URL ?? (apiRequestMode === 'proxy' ? '/static/' : `${derivedBackendBaseUrl}/static/`),
    VITE_VDITOR_CDN: import.meta.env.VITE_VDITOR_CDN ?? '/vditor',
    VITE_SITE_ICP: import.meta.env.VITE_SITE_ICP ?? '',
    VITE_SITE_ICP_LINK: import.meta.env.VITE_SITE_ICP_LINK ?? '',
    VITE_SITE_NAME: import.meta.env.VITE_SITE_NAME ?? 'My Blog',
    VITE_GITHUB_REPO: import.meta.env.VITE_GITHUB_REPO ?? '小宋哒哒',
    VITE_GITHUB_REPO_URL: import.meta.env.VITE_GITHUB_REPO_URL ?? '#',
    VITE_BACKEND_BASE_URL: trimTrailingSlash(import.meta.env.VITE_BACKEND_BASE_URL ?? (apiRequestMode === 'proxy' ? '' : derivedBackendBaseUrl)),
    VITE_BACKEND_STATIC: import.meta.env.VITE_BACKEND_STATIC ?? 'static',
}

export default config