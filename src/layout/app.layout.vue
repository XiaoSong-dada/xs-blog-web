<template>
  <div class="main">
    <header-menu />
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderMenu from "@/layout/header/menu.vue";
</script>

<style scoped>
</style>
