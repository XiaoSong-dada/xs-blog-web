<template>
    <vditor-compoment :upload-url="upload.upload_url" upload-type="image"/>
</template>

<script setup lang="ts">
import VditorCompoment from '@/components/vditor/vditor.compoment.vue';
import {config} from '@/config/local.env'
import { requestHttp } from '@/utils/http';
import { reactive } from 'vue';


const upload = reactive({
    upload_url: '/api/file',
    upload_type:'image'
})


</script>

<style scoped lang="scss">
.article-editor {
    height: 100%;
}
</style>