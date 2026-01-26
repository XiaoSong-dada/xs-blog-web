// /services/authService.ts
import config from '@config/local.env';
import useAuthStore from '../stores/auth';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import type { JwtCheckOptions } from '../types/main';


class AuthService {
    static setToken(token: string) {
        useAuthStore().setToken(token);
        Cookies.set(config.TOKEN_KEY, token, { expires: 1, secure: true, sameSite: 'Strict' });
    }

    static getToken() {
        return useAuthStore().token || Cookies.get(config.TOKEN_KEY);
    }

    static clearToken() {
        useAuthStore().clearToken();
        Cookies.remove(config.TOKEN_KEY);
    }

    static isTokenExpired(token: string, opt: JwtCheckOptions = {}): boolean {
        const leewayMs = opt.leewayMs ?? 30_000;
        const treatNoExpAsExpired = opt.treatNoExpAsExpired ?? false;

        try {
            const { exp } = jwtDecode<{ exp?: number }>(token);
            if (!exp) return treatNoExpAsExpired;
            return Date.now() >= exp * 1000 - leewayMs;
        } catch {
            return true;
        }
    }
}

export default AuthService;
