<template>

    <a-tabs class="top-menu" v-model:activeKey="activeKey" centered type="line" :tabBarGutter="80"
        @change="handleTabChange">
        <a-tab-pane v-for="item in homeTopMenu" v-model:key="item.key" :tab="item.label" />
        <template #rightExtra>
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
    if (path.startsWith('/center')) return 'center'
    if (path.startsWith('/article')) return 'article'
    if (path.startsWith('/about')) return 'about'
    return 'home'
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

    .top-right {
        gap: 30px;

        .login-status {
            height: 40px;
            padding-right: 20px;
        }

    }

  :deep(.ant-tabs-nav) {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
    z-index: 1;
  }
}
</style>
