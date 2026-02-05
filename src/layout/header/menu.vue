<template>
    <a-tabs class="top-menu" v-model:activeKey="activeKey" type="line" :tabBarGutter="20" @change="handleTabChange">
        <template #leftExtra>
            <span class="top-menu-logo">小宋博客</span>
        </template>
        <a-tab-pane v-for="item in homeTopMenu" v-model:key="item.key" :tab="item.label" />
        <template #rightExtra>
            <header-search @search-article="search" @clear-article="clear"/>
            <div class="top-right flex-start align-center">
                <div>
                </div>
                <div class="login-status align-center flex-end">
                    <UserAvatar v-if="isLogin" />
                    <LoginButton v-else />
                </div>
            </div>

        </template>
    </a-tabs>
</template>

<script setup lang="ts">
import { homeTopMenu } from '@/constants/home.top.menu';
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { Tabs, TabPane } from 'ant-design-vue';
import type { HomeTopMenuItem } from '@/types/main';
import { useRouter, useRoute } from 'vue-router';
import { AuthService } from '@/service/auth.service';
import LoginButton from '@/components/auth/login.button.vue';
import UserAvatar from '@/components/auth/user.avatar.vue';
import useAuthStore from '@/stores/auth';
import { storeToRefs } from 'pinia';
import HeaderSearch from '@/components/header/search.vue'

// import userDropDown from '@/components/auth/user.drop.down.vue';
const authStore = useAuthStore();
const { token } = storeToRefs(authStore);
const ATabs = Tabs;
const ATabPane = TabPane;
const homeTopMenuMap = reactive(new Map<string, HomeTopMenuItem>());
const router = useRouter();
const route = useRoute()
const activeKey = ref('home');

onMounted(() => {
    homeTopMenu.forEach(item => {
        homeTopMenuMap.set(item.key, item);
    });
    authStore.loadToken();
});

const handleTabChange = (key: string | number) => {
    const item = homeTopMenuMap.get(key as string);
    if (item) router.push(item.route);
}

const isLogin = computed(() => {
    if (!token.value) return false;
    return !AuthService.isTokenExpired(token.value);
});

// 解决菜单项聚焦问题
const routeToKey = (path: string) => {
    if (path.startsWith('/admin')) return 'admin'
    if (path.startsWith('/article/')) return 'article-detail'
    if (path.startsWith('/article')) return 'article'
    if (path.startsWith('/about')) return 'about'
    return 'home'
}


const search = (val:string) =>{
    router.push(`./article?kw=${val}&offset=${0}&limit=${10}`)
}

const clear = ()=>{
    router.push(`./article`)
}

watch(
    () => route.path,
    (path) => {
        activeKey.value = routeToKey(path)
    },
    { immediate: true }
)
</script>

<style scoped lang="scss">
.top-menu {
    &-logo {
        padding-left: 20px;
        margin-right: 20px;
    }

    height: $header-h;
    position: sticky;
    top: 0;
    z-index: 1000;
    background: #fff;

    .top-right {
        gap: 30px;

        .login-status {
            height: 40px;
            padding-right: 20px;
        }

    }

    :deep(.ant-tabs-nav) {
        background-color: #fff;
        margin-bottom: 0;
        height: $header-h;
        position: relative;
    }

    :deep(.top-menu-search) {
        position: absolute;
        left: clamp(500px, 50%, 50%);
        top: 50%;
        transform: translate(-50%, -50%);
        width: 500px;
        min-width: 200px;
        max-width: calc(100vw - 320px);
    }

}
</style>
