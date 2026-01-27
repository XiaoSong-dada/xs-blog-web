<template>
    <div class="user-avatar flex-end align-center">
        <user-drop-down :items="menus" @select="handleSelect">
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
import userDropDown from './user.drop.down.vue';
import {menus} from '@/router/user.drop.items';
import { useRouter } from 'vue-router';

const userInfo = ref<IUserInfo>()
const router = useRouter()
onMounted(() => {
    console.log(AuthService.getUserInfo());
    const user = AuthService.getUserInfo();
    if (user) userInfo.value = user;
})

const avatarUrl = computed<string>(() => userInfo.value?.avatar_url ? userInfo.value?.avatar_url : defaultAvatar)
const handleSelect = (select:IDropDownItem) =>{
    console.log(select);

    if(select.click) select.click();
    if(select.route) router.push(select.route);
}

</script>

<style scoped lang="scss">
.user-avatar {
    gap: 30px;
    height: 40px;
    width: 50px;
}
</style>