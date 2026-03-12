<template>
    <div class="user-avatar flex-end align-center">
        <user-drop-down :items="userInfo?.is_admin ? adminMenus :userMenus" @select="handleSelect">
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
import { adminMenus,userMenus } from '@/constants/auth-menu';
import userDropDown from './user.drop.down.vue';
import { getUserInfo } from '@/api/user/user';
import { Avatar } from 'ant-design-vue';
import { useComputedUrl } from '@/hook/file/useFile';

const AAvatar = Avatar;
const userInfo = ref<IUserInfo>()
const avatarUrl = ref<string>(defaultAvatar)
const router = useRouter()
const { computeImageUrl } = useComputedUrl();

const fetchAvatar = async () => {
    const res = await getUserInfo()
    const candidate = res.data
    avatarUrl.value = computeImageUrl(candidate?.avatar_url)
}

onMounted(async () => {
    const user = AuthService.getUserInfo();
    if (user) {
        userInfo.value = user;
        try {
            await fetchAvatar()
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
