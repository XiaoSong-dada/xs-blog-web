<template>
    <div class="user-avatar flex-end align-center">
        <user-drop-down :items="authMenus" @select="handleSelect">
            <template #image>
                <a-avatar :src="avatarUrl" ></a-avatar>
            </template>
        </user-drop-down>
    </div>
</template>

<script setup lang="ts">
import defaultAvatar from '@/assets/user.svg';
import { onMounted, ref } from 'vue';
import type { IDropDownItem, IUserInfo } from '@/types/main';
import { AuthService } from '@/service/auth.service';
import { useRouter } from 'vue-router';
import { authMenus } from '@/constants/auth-menu';
import userDropDown from './user.drop.down.vue';
import { getList } from '@/api/user/user';
import { config } from '@/config/local.env';
import { Avatar } from 'ant-design-vue';

const AAvatar = Avatar;
const userInfo = ref<IUserInfo>()
const avatarUrl = ref<string>(defaultAvatar)
const router = useRouter()

const resolveAvatarUrl = (path?: string | null) => {
    if (!path) return defaultAvatar
    if (path.startsWith('http')) return path
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path
    return `${config.VITE_STATIC_URL.replace(/\/$/, '')}/${normalizedPath}`
}

const fetchAvatar = async (username: string) => {
    const res = await getList({ username, offset: 0, limit: 1 })
    const candidate = Array.isArray(res.data) ? res.data[0] : res.data?.list?.[0]
    avatarUrl.value = resolveAvatarUrl(candidate?.avatar_url)
}

onMounted(async () => {
    console.log(AuthService.getUserInfo());
    const user = AuthService.getUserInfo();
    if (user) {
        userInfo.value = user;
        try {
            await fetchAvatar(user.username)
        } catch {
            avatarUrl.value = defaultAvatar
        }
    }
})
const handleSelect = (item: IDropDownItem) => {
    if (item.action === 'logout') {
        AuthService.clearToken();
        userInfo.value = undefined;
        avatarUrl.value = defaultAvatar;
    }
    if (item.route && item.route !== router.currentRoute.value.path) {
        router.push(item.route);
    }
}

</script>

<style scoped lang="scss">
.user-avatar {
    gap: 30px;
    height: 40px;
    width: 50px;
}
</style>
