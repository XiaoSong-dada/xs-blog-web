<template>
    <div class="user-avatar flex-end align-center">
        <img :src="avatarUrl"></img>
    </div>
</template>

<script setup lang="ts">
import defaultAvatar from '@/assets/user.svg'
import { onMounted, ref, computed } from 'vue';
import type { IUserInfo } from '@/types/main'
import { AuthService } from '@/service/auth.service';
const userInfo = ref<IUserInfo>()

onMounted(() => {
    console.log(AuthService.getUserInfo());
    const user = AuthService.getUserInfo();
    if (user) userInfo.value = user;
})

const avatarUrl = computed<string>(() => userInfo.value?.avatar_url ? userInfo.value?.avatar_url : defaultAvatar)

</script>

<style scoped lang="scss">
.user-avatar {
    gap:30px;
    height:40px;
    width: 50px;
}
</style>