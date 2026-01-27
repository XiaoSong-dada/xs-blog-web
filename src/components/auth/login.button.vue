<template>
    <div class="login-button flex-evenly" @click="router.push('/login')">
        <img src="../../assets/user.svg"></img>
        <text>未登录</text>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter()

</script>

<style scoped lang="scss">
.login-button {
    gap: 20px;
    height: 40px;
    .user-out-lined {
        font-size: 24px;
        line-height: 40px;
    }

    text {
        display: block;
        height: 40px;
        line-height: 40px;
    }
}
</style>