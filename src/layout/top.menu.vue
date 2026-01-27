<template>
    <a-tabs class="top-menu" v-model:activeKey="activeKey" centered type="line" :tabBarGutter="80"
        @change="handleTabChange">
        <a-tab-pane v-for="item in homeTopMenu" :key="item.key" :tab="item.label" />
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
import { homeTopMenu } from '@/router/home.top.menu';
import { ref, reactive, onMounted, computed } from 'vue';
import { Tabs, TabPane } from 'ant-design-vue';
import type { HomeTopMenuItem } from '@/types/main';
import { useRouter } from 'vue-router';
import { AuthService } from '@/service/auth.service';
import LoginButton from '@/components/auth/login.button.vue';
import UserAvatar from '@/components/auth/user.avatar.vue';
import useAuthStore from '@/stores/auth';
import { storeToRefs } from 'pinia';

// import userDropDown from '@/components/auth/user.drop.down.vue';
const authStore = useAuthStore();
const { token } = storeToRefs(authStore);
const isLogin = computed(() => {
    if (!token.value) return false;
    return !AuthService.isTokenExpired(token.value);
});

const ATabs = Tabs;
const ATabPane = TabPane;
const homeTopMenuMap = reactive(new Map<string, HomeTopMenuItem>());
const router = useRouter();
const activeKey = ref('1');

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
</script>

<style scoped lang="scss">
.top-menu {
    .top-right {
        gap: 30px;
        .login-status {
            height: 40px;
            padding-right: 20px;
        }

        :deep(ant-tabs-extra-content) {
            height: 40px;
            line-height: 40px;
        }
    }

}
</style>
