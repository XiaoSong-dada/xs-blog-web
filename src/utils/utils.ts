import config from '../../config/local.env.ts'

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const setLoginCookie = (token: string, days = 7): void => {
    const expires = new Date()
    expires.setDate(expires.getDate() + days)
    document.cookie = `${config.TOKEN_COOKIE}=${encodeURIComponent(token)}; expires=${expires.toUTCString()}; path=/`
}

export const getCookie = (name: string): string | null => {
    const pattern = new RegExp(`(?:^|; )${escapeRegExp(name)}=([^;]*)`)
    const match = document.cookie.match(pattern)
    const value = match?.[1]
    return value ? decodeURIComponent(value) : null
}

export const clearCookie = (name: string): void => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
}

export const isLogin = (): boolean => Boolean(getCookie(config.TOKEN_COOKIE))
