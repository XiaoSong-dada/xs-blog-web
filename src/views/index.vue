<template>
    <div class="main">
        <header-menu />
        <div class="main-content">
            <router-view />
        </div>
    </div>
</template>

<script setup lang="ts">
import HeaderMenu from '@/layout/header/menu.vue';

</script>

<style scoped lang="scss">
.main {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .main-content {
        flex: 1;
        min-height: 0;
    }
}
</style>