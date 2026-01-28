import { defineStore } from 'pinia';
import Cookies from 'js-cookie';
import { config } from '@config/local.env';

const useAuthStore = defineStore('auth', {
    state: () => ({
        token: null as string | null,
    }),
    actions: {
        setToken(token: string) {
            this.token = token;
        },
        clearToken() {
            this.token = null;
        },
        loadToken() {
            const tokenFromCookie = Cookies.get(config.TOKEN_KEY);
            if (tokenFromCookie) {
                this.token = tokenFromCookie;
            }
        },
    }
})

export default useAuthStore;
