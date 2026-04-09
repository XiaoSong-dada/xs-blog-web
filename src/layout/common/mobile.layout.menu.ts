import type { InjectionKey, Ref } from 'vue';

export interface MobileLayoutMenuContext {
    isMobileMenuOpen: Ref<boolean>;
    isMobileMenuRoute: Ref<boolean>;
    openMenu: () => void;
    closeMenu: () => void;
    toggleMenu: () => void;
}

export const mobileLayoutMenuKey: InjectionKey<MobileLayoutMenuContext> = Symbol('mobile-layout-menu');
