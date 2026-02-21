<template>
    <div class="article-editor-page">
        <div class="tag-toolbar">
            <a-flex align="center" :gap="10">
                <span>文章标签：</span>
                <a-select
                    v-model:value="selectedTagIds"
                    mode="multiple"
                    :options="tagOptions"
                    placeholder="请选择标签"
                    class="tag-select"
                    :max-tag-count="4"
                    :allow-clear="true"
                />
            </a-flex>
        </div>

        <vditor-compoment
            :upload-url="upload.upload_url"
            upload-type="image"
            @save-draft="createArticle"
            :mode="modle"
            @edit-draft="editArticle"
            @publish="publishArticle"
            @is-dirty="(dirty) => isDirty = dirty"
            :form="vditroFrom"
            @go-back="goBackToAdmin"
            :autosave="false"
            :markdown="markdown"
            :initial="initVditor"
        />
    </div>
</template>

<script setup lang="ts">
import VditorCompoment from '@/components/vditor/vditor.compoment.vue';
import { useArticleDetailById, useArticleEditor } from '@/hook/article/useArticle';
import { getTagList } from '@/api/tag/tag';
import router from '@/router/main';
import type { IActicleFrom, ArticlePayload } from '@/types/vditor';
import type { ITag } from '@/types/main';
import { onMounted, reactive, ref, watch } from 'vue';
import { Flex, Select } from 'ant-design-vue';

const AFlex = Flex;
const ASelect = Select;

const { article_id, modle, isDirty, createArticle, editArticle, publishArticle, selectedTagIds, setTagIds } = useArticleEditor();
const prop = defineProps<{ id?: string }>();
const { articleDetail, getArticleDetail } = useArticleDetailById();
const tagList = ref<ITag[]>([]);
const tagOptions = ref<{ label: string; value: string }[]>([]);
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

const goBackToAdmin = () => {
    router.push({ path: '/admin/article' });
}

const loadTags = async () => {
    const res = await getTagList({ limit: 1000, offset: 0, name: '', slug: '' });
    tagList.value = res.data ?? [];
    tagOptions.value = tagList.value.map(tag => ({
        label: `${tag.name} (${tag.slug})`,
        value: tag.id,
    }));
}

onMounted(() => {
    loadTags();
    // 当传入prop时则设置当前页面为修改页面
    if (prop.id) {
        getArticleDetail(prop.id)
    } else {
        setTagIds([])
    }
})

watch(
    () => articleDetail.value,
    (article) => {
        console.log(article);
        
        initVditor.value.content_md  = article?.content_md ?? '';
        initVditor.value.title = article?.title ?? '';
        initVditor.value.slug = article?.slug ?? '';
        article_id.value = article?.id ?? '';
        setTagIds((article?.tags ?? []).map(tag => tag.id));
        modle.value = 'edit';
    }
)

</script>

<style scoped lang="scss">
.article-editor-page {
    height: 100%;

    .tag-toolbar {
        padding-bottom: 12px;
    }

    .tag-select {
        min-width: 360px;
    }
}
</style>