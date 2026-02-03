<template>
    <vditor-compoment :upload-url="upload.upload_url" upload-type="image" @save-draft="createArticle" :mode="modle"
        @edit-draft="editArticle" @publish="publishArticle" @is-dirty="(dirty) => isDirty = dirty" :form="vditroFrom"
        :markdown="markdown" :initial="initVditor" />
</template>

<script setup lang="ts">
import VditorCompoment from '@/components/vditor/vditor.compoment.vue';
import { useArticleDetailById, useArticleEditor } from '@/hook/article/useArticle';
import type { IActicleFrom, ArticlePayload } from '@/types/vditor';
import { onMounted, reactive, ref, watch } from 'vue';

const { article_id, modle, isDirty, createArticle, editArticle, publishArticle } = useArticleEditor();
const prop = defineProps<{ id?: string }>();
const { articleDetail, getArticleDetail } = useArticleDetailById();
const initVditor = ref<Partial<ArticlePayload>>({
        title: '',
        slug: '',
        content_md: ''
    });
const markdown = ref<string>('');
const vditroFrom = ref<IActicleFrom>({
    title: '',
    slug: ''
});


const upload = reactive({
    upload_url: '/api/file',
    upload_type: 'image'
})

onMounted(() => {
    // 当传入prop时则设置当前页面为修改页面
    if (prop.id) {
        getArticleDetail(prop.id)
    }
})

watch(
    () => articleDetail.value,
    (article) => {
        initVditor.value.content_md  = article?.content_md ?? '';
        initVditor.value.title = article?.title ?? '';
        initVditor.value.slug = article?.slug ?? '';
        article_id.value = article?.id ?? '';
        modle.value = 'edit';
    }
)

</script>

<style scoped lang="scss">
.article-editor {
    height: 100%;
}
</style>