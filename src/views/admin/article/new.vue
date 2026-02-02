<template>
    <vditor-compoment 
    :upload-url="upload.upload_url" 
    upload-type="image"
    @save-draft="createArticle"
    :mode="modle"
    @edit-draft="editArticle"
    @publish="publishArticle"
    @is-dirty="(dirty)=>isDirty = dirty"
    />
</template>

<script setup lang="ts">
import VditorCompoment from '@/components/vditor/vditor.compoment.vue';
import {  useArticleEditor } from '@/hook/article/useArticle';
import { reactive } from 'vue';

const { modle , isDirty,createArticle , editArticle,publishArticle} = useArticleEditor()

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