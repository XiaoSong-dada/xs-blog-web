<template>
    <div class="header flex-item-center">
        <div class="header-left" :class="{ 'is-hidden': isMobile && isMobileSearchExpanded }">
            <h1 class="header-logo">小宋小站</h1>
            <top-tag class="top-menu" :items="homeTopMenu" :active-key="activeKey" @change="handleTabChange" />
        </div>

        <div class="header-center flex-center" :class="{ 'is-expanded': isMobile && isMobileSearchExpanded }">
            <header-search class="header-search" v-if="!isMobile" @search-article="search" @clear-article="clear" />

            <a-button v-else-if="!isMobileSearchExpanded" class="mobile-search-trigger" shape="circle" @click="openMobileSearch" aria-label="搜索">
                <template #icon>
                    <SearchOutlined />
                </template>
            </a-button>

            <div
                v-else
                ref="mobileSearchWrapRef"
                class="mobile-search-input inline-block"
                @focusout="handleMobileSearchFocusOut"
            >
                <a-input-search
                    ref="mobileSearchInputRef"
                    v-model:value="mobileSearchKeyword"
                    enter-button
                    allowClear
                    placeholder="搜索文章内容"
                    @search="handleMobileSearch"
                />
            </div>
        </div>

        <div class="header-right">
            <UserAvatar v-if="isLogin" />
            <LoginButton v-else />
        </div>
        <a-button
            v-if="shouldShowFloatingMenuTrigger"
            class="mobile-layout-menu-trigger"
            shape="circle"
            @click="toggleMobileLayoutMenu"
            aria-label="侧栏菜单"
        >
            <template #icon>
                <MenuFoldOutlined v-if="isMobileLayoutMenuOpen" />
                <MenuUnfoldOutlined v-else />
            </template>
        </a-button>
    </div>
</template>

<script setup lang="ts">
import { homeTopMenu } from '@/constants/home.top.menu';
import { ref, reactive, onMounted, onBeforeUnmount, computed, watch, nextTick, inject } from 'vue';
import { Button, InputSearch } from 'ant-design-vue';
import type { HomeTopMenuItem } from '@/types/main';
import { useRouter, useRoute } from 'vue-router';
import { AuthService } from '@/service/auth.service';
import LoginButton from '@/components/auth/login.button.vue';
import UserAvatar from '@/components/auth/user.avatar.vue';
import useAuthStore from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { SearchOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue';
import HeaderSearch from '@/components/header/search.vue'
import TopTag from '@/components/header/top.tag.vue';
import { mobileLayoutMenuKey } from '@/layout/common/mobile.layout.menu';

// import userDropDown from '@/components/auth/user.drop.down.vue';
const authStore = useAuthStore();
const { token } = storeToRefs(authStore);
const AButton = Button;
const AInputSearch = InputSearch;
const homeTopMenuMap = reactive(new Map<string, HomeTopMenuItem>());
const router = useRouter();
const route = useRoute()
const activeKey = ref('home');
const headerSearch = ref<string>('');
const mobileSearchKeyword = ref('');
const isMobile = ref(false);
const isMobileSearchExpanded = ref(false);
const mobileSearchWrapRef = ref<HTMLElement | null>(null);
const mobileSearchInputRef = ref<{ focus?: () => void } | null>(null);
const mobileLayoutMenu = inject(mobileLayoutMenuKey, null);

const MOBILE_BREAKPOINT = 992;

const updateViewportState = () => {
    const isCurrentMobile = window.innerWidth < MOBILE_BREAKPOINT;
    isMobile.value = isCurrentMobile;

    if (!isCurrentMobile) {
        isMobileSearchExpanded.value = false;
        mobileSearchKeyword.value = '';
    }
};

onMounted(() => {
    homeTopMenu.forEach(item => {
        homeTopMenuMap.set(item.key, item);
    });
    authStore.loadToken();
    updateViewportState();
    window.addEventListener('resize', updateViewportState);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateViewportState);
});

const handleTabChange = (key: string) => {
    const item = homeTopMenuMap.get(key);
    if (item){
        if(item.route === '/article' && headerSearch.value){
            return router.push(`/article?kw=${headerSearch.value}&offset=${0}&limit=${10}`)
        }
        return router.push(item.route);
    }
}

const openMobileSearch = () => {
    mobileLayoutMenu?.closeMenu();
    isMobileSearchExpanded.value = true;
    mobileSearchKeyword.value = headerSearch.value;
    nextTick(() => {
        mobileSearchInputRef.value?.focus?.();
    });
};

const isMobileLayoutMenuOpen = computed(() => {
    return mobileLayoutMenu?.isMobileMenuOpen.value ?? false;
});

const shouldShowFloatingMenuTrigger = computed(() => {
    return isMobile.value && !isMobileSearchExpanded.value && Boolean(mobileLayoutMenu?.isMobileMenuRoute.value);
});

const toggleMobileLayoutMenu = () => {
    mobileLayoutMenu?.toggleMenu();
};

const collapseMobileSearch = () => {
    isMobileSearchExpanded.value = false;
};

const handleMobileSearch = (val: string) => {
    if (!val) {
        clear();
    } else {
        search(val);
    }
    collapseMobileSearch();
};

const handleMobileSearchFocusOut = (event: FocusEvent) => {
    if (!isMobile.value || !isMobileSearchExpanded.value) return;

    const nextFocusTarget = event.relatedTarget as Node | null;
    if (nextFocusTarget && mobileSearchWrapRef.value?.contains(nextFocusTarget)) {
        return;
    }

    collapseMobileSearch();
};

const isLogin = computed(() => {
    if (!token.value) return false;
    return !AuthService.isTokenExpired(token.value);
});

// 解决菜单项聚焦问题
const routeToKey = (path: string) => {
    if (path.startsWith('/admin')) return 'admin'
    if (path.startsWith('/friend-link')) return 'friend-link'
    if (path.startsWith('/article/')) return 'article-detail'
    if (path.startsWith('/article')) return 'article'
    if (path.startsWith('/about')) return 'about'
    if (path.startsWith('/me')) return 'me'
    return ''
}


const search = (val:string) =>{
    headerSearch.value = val;
    router.push(`/article?kw=${val}&offset=${0}&limit=${10}`)
}

const clear = ()=>{
    headerSearch.value = '';
    mobileSearchKeyword.value = '';
    router.push(`/article`)
}

watch(
    () => route.path,
    (path) => {
        activeKey.value = routeToKey(path)
    },
    { immediate: true }
)

watch(
    mobileSearchKeyword,
    (val, oldVal) => {
        if (isMobile.value && isMobileSearchExpanded.value && oldVal && !val) {
            clear();
        }
    }
)
</script>

<style scoped lang="scss">
.header {
    box-sizing: border-box;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    column-gap: 16px;
    border-bottom: 1px solid #f0f0f0;
    &-logo {
        margin: 0;
        margin-right: 20px;
        white-space: nowrap;
    }

    padding: 0 10px;

    height: $header-h;
    position: sticky;
    top: 0;
    z-index: 1000;
    background: #fff;

    .header-left {
        min-width: 0;
        display: flex;
        align-items: center;
        overflow: hidden;
        height: $header-h;

        &.is-hidden {
            width: 0;
            opacity: 0;
            margin: 0;
            pointer-events: none;
            display: none;
        }
    }

    .top-menu {
        min-width: 0;
        flex: 0 0 150px;
        height: 100%;
        display: flex;
        width: 150px;
        align-items: stretch;
    }

    .header-center {
        min-width: 0;
        width: auto;
        display: flex;
        justify-content: center;
        justify-self: center;
    }

    .header-center :deep(.ant-input-search) {
        width: 100%;
        max-width: 100%;
    }

    .header-search {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 512px;
        max-width: 512px;
        z-index: 1200;
        pointer-events: auto;
    }

    .header-right {
        justify-self: end;
        display: flex;
        align-items: center;
        min-width: max-content;
        flex-shrink: 0;
    }

    .mobile-search-trigger {
        display: none;
    }

    .mobile-search-input {
        display: none;
    }

    .mobile-layout-menu-trigger {
        display: none;
        position: absolute;
        top: 100%;
        right: 12px;
        margin-top: 8px;
        z-index: 1101;
    }

    // 清除h1默认样式并保留所需外观
    h1 {
        font-size: 16px;
        font-weight: normal;
    }

    @media (max-width: 992px) {
        grid-template-columns: minmax(0, 1fr) auto auto;
        column-gap: 8px;
        padding-bottom: 0;
        .header-center {
            position: static;
            min-width: 0;
            width: auto;
            justify-self: end;
            grid-column: 2;

            &.is-expanded {
                width: 100%;
                grid-column: 1 / 3;
            }
        }

        .header-search {
            position: static;
            transform: none;
            width: 100%;
            max-width: none;
        }

        .header-right {
            grid-column: 3;
        }

        .header-left {
            transition: width 0.25s ease, opacity 0.25s ease;
        }

        .top-menu {
            overflow: hidden;
        }

        .mobile-search-trigger {
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }

        .mobile-search-input {
            display: block;
            width: 100%;
        }

        .mobile-layout-menu-trigger {
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }

        :deep(.login-button) {
            width: auto;
            gap: 8px;
        }

        :deep(.login-button .ant-btn) {
            padding-inline: 10px;
        }

        :deep(.user-avatar) {
            width: 40px;
            gap: 0;
        }


    }


}
</style>
