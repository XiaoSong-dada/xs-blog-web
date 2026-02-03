<template>
  <div class="app-layout">
    <header-menu />
    <div class="main-content" :class="{ 'admin-layout': isAdmin }">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderMenu from "@/layout/header/menu.vue";
import { computed } from 'vue';
import { useRoute } from "vue-router";


const route = useRoute();

const isAdmin = computed(() => route.path.startsWith('/admin'));

</script>

<style scoped lang="scss">
.app-layout {
  .main-content {
    padding-top: $editor-content-padding;

    &.admin-layout {
      padding-top: 0;
    }
  }

}
</style>
