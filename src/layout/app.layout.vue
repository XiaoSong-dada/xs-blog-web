<template>
  <div class="app-layout">
    <header-menu />
    <div class="main-content" :class="{ 'admin-layout': isNeedPadding }">
      <router-view />
    </div>
    <footer v-if="siteIcp" class="site-footer">

      <span>Copyright © {{ new Date().getFullYear() }} {{ config.VITE_SITE_NAME }}</span>
      <span> | </span>
      <a
        v-if="siteIcpLink"
        :href="siteIcpLink"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ siteIcp }}
      </a>
      <span v-else>{{ siteIcp }}</span>
      <span> | </span>
      <span>
        <a
          :href="config.VITE_GITHUB_REPO_URL"
          target="_blank"
          rel="noopener noreferrer"
        >
        <github-outlined />
          {{ config.VITE_GITHUB_REPO }}
        </a>
      </span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import HeaderMenu from "@/layout/header/menu.vue";
import { computed } from 'vue';
import { useRoute } from "vue-router";
import { config } from '@/config/config';
import { GithubOutlined } from "@ant-design/icons-vue";


const route = useRoute();
const siteIcp = config.VITE_SITE_ICP;
const siteIcpLink = config.VITE_SITE_ICP_LINK;

const isNeedPadding = computed(() => {
  const path = route.path;

  return (
    path === '/' ||
    path.startsWith('/admin') ||
    path.startsWith('/me') ||
    path.startsWith('/article')
  );
});
</script>

<style scoped lang="scss">
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  .main-content {
    flex: 1;
    overflow: auto;

    &.admin-layout {
      padding-top: 0;
    }
  }

  .site-footer {
    padding: 12px 16px;
    text-align: center;
    color: #666;
    font-size: 13px;
    border-top: 1px solid #f0f0f0;
    background: #fff;

    a {
      color: inherit;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }
  }

}
</style>
