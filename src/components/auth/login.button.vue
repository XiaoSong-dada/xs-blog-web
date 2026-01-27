<template>
    <div class="login-button flex-evenly" @click="router.push('/login')">
        <a-button type="primary">登录/注册</a-button>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Button } from 'ant-design-vue';
const AButton =  Button;


const router = useRouter()

</script>

<style scoped lang="scss">
.login-button {
    gap: 20px;
    width: 100px;
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