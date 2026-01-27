<template>
    <div class="user-avatar flex-end align-center">
        <user-drop-down :items="authMenus" @select="handleSelect">
            <template #image>
                <img :src="avatarUrl"></img>
            </template>
        </user-drop-down>
    </div>
</template>

<script setup lang="ts">
import defaultAvatar from '@/assets/user.svg';
import { onMounted, ref, computed } from 'vue';
import type { IDropDownItem, IUserInfo } from '@/types/main';
import { AuthService } from '@/service/auth.service';
import { useRouter } from 'vue-router';
import { authMenus } from '@/constants/auth-menu';
import userDropDown from './user.drop.down.vue';

const userInfo = ref<IUserInfo>()
const router = useRouter()
onMounted(() => {
    console.log(AuthService.getUserInfo());
    const user = AuthService.getUserInfo();
    if (user) userInfo.value = user;
})

const avatarUrl = computed<string>(() => userInfo.value?.avatar_url ? userInfo.value?.avatar_url : defaultAvatar)
const handleSelect = (item: IDropDownItem) => {
    if (item.action === 'logout') {
        AuthService.clearToken();
        userInfo.value = undefined;
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
