<template>
    <div class="main">
        <top-menu />
        <div class="cover-with-height">

            <router-view />
        </div>
    </div>
</template>

<script setup lang="ts">
import topMenu from '@/layout/top.menu.vue';

</script>

<style scoped lang="scss">
.main{
    width: 100%;
    height: 100%;
}
</style>