<template>
    <div class="center-article">
        <div class="toobar">
            <a-flex class="header" :gap="40">
                <a-flex gap="small">
                    <a-flex class="search-item">
                        <text>
                            标记：
                        </text>
                        <div class="flex-center flex-column">
                            <a-input v-model:value="params.slug" />
                        </div>
                    </a-flex>
                    <a-flex class="search-item">
                        <text>
                            标题：
                        </text>
                        <div class="flex-center flex-column">
                            <a-input v-model:value="params.title" />
                        </div>
                    </a-flex>
                    <a-flex class="search-item">
                        <text>
                            内容：
                        </text>
                        <div class="flex-center flex-column">
                            <a-input v-model:value="params.content_md" />
                        </div>
                    </a-flex>
                </a-flex>
                <a-flex gap="small" align="center">
                    <a-button type="primary" :icon="h(SearchOutlined)" @click="onSearch">搜索</a-button>
                    <a-button :icon="h(SyncOutlined)" @click="onReset">重置</a-button>
                </a-flex>
            </a-flex>
            <a-flex class="tools" gap="small">
                <a-button type="primary" :icon="h(PlusOutlined)"
                    @click="() => router.push('./article/new')">新增</a-button>
                <a-button type="primary" @click="openUploadModal">
                    <upload-outlined></upload-outlined>
                    导入
                </a-button>


                <!-- <a-button type="primary" :icon="h(VerticalAlignTopOutlined)" @click="importMarkDown">导入</a-button> -->
                <a-button type="primary" :icon="h(VerticalAlignBottomOutlined)" @click="downMarkDown">导出</a-button>
            </a-flex>
        </div>
        <a-table :columns="columns" :data-source="data" :scroll="{ x: '100%', y: computTableHeight }" :loading="loading"
            :pagination="paginationComputed" :row-selection="rowSelection" row-key="slug">
            <template #bodyCell="{ column, record, index }">
                <template v-if="column.key === 'index'">
                    {{ buildIndex(params, index) }}
                </template>
                <template v-else-if="column.key === 'content_md'">
                    {{ omitString(record.content_md) }}
                </template>
                <template
                    v-if="['created_at', 'updated_at', 'published_at', 'deleted_at'].includes(String(column.key))">
                    {{ (column.key && record[column.key]) ? formatDate(record[column.key]) : '' }}
                </template>
                <template v-if="column.key === 'action'">
                    <a-button type="link" :icon="h(EditOutlined)" @click="updateArticle(record.id)">修改</a-button>
                    <a-popconfirm :title="`是否确认删除文章${record.slug}`" ok-text="确认" cancel-text="取消"
                        @confirm="notDevelopedMessage()">
                        <a-button type="link" danger :icon="h(DeleteOutlined)">删除</a-button>
                    </a-popconfirm>
                </template>
            </template>
        </a-table>
        <a-modal v-model:open="openUpload" title="上传文件" okText="确认" cancelText="取消">
            <a-upload v-model:file-list="fileList" name="file" directory accept=".png,.jpg,.jpeg,.md"
                :before-upload="beforeUpload">
                <a-button>
                    <upload-outlined />
                    上传文件
                </a-button>
            </a-upload>
            <a-button @click="submitFile" class="submit-button">
                <CheckOutlined />
                提交文件
            </a-button>
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import { Table, Button, Flex, Input, Popconfirm, message, UploadDragger, type UploadFile, Modal, Upload } from 'ant-design-vue';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons-vue';
import { useArticleList } from '@/hook/article/useArticle'
import {
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    VerticalAlignBottomOutlined,
    VerticalAlignTopOutlined,
    UploadOutlined,
    SyncOutlined,
    InboxOutlined,
    CheckOutlined
} from '@ant-design/icons-vue';
import { computed, h, onMounted, ref } from 'vue'
import { notDevelopedMessage } from '@/ui/status/not-developed';
import { formatDate } from '@/utils/date';
import { useBuildTableIndex } from '@/hook/useBuilding';
import { useRouter } from 'vue-router';
import { useTableHeight } from '@/hook/layout/useLayout';
import { omitString } from '@/utils/utils';
import { useFiles, useSession } from '@/hook/file/useSession';

const ATable = Table;
const AButton = Button;
const AFlex = Flex;
const AInput = Input;
const APopconfirm = Popconfirm;
const AUploadDragger = UploadDragger;
const AUpload = Upload;
const AModal = Modal;
const { columns, params, data, total, loading, fetchList, resetParams, rowSelection, selectedRows } = useArticleList();
const { session, createSession } = useSession();
const { extractImagePaths, isMdFile, readMdFromFileList, isImageFile } = useFiles();
const { buildIndex } = useBuildTableIndex();
const { tableHeight, tableHeightOnMounted } = useTableHeight();
const router = useRouter();
const fileList = ref<UploadFile[]>();
const openUpload = ref<boolean>(false);
const filteredCount = ref<number>(0);
const GROUP_COUNT = 10;


const onSearch = () => {
    params.value.offset = 1
    fetchList()
}

const onReset = () => {
    resetParams()
    fetchList()
}

const onTableChange = (page: number, pageSize: number) => {
    params.value.offset = page
    params.value.limit = pageSize
    fetchList()
}

const paginationComputed = computed(() => ({
    current: params.value.offset || 1,
    pageSize: params.value.limit || 10,
    total: total.value,
    showSizeChanger: true,
    onChange: onTableChange,
    onShowSizeChange: onTableChange,
    showTotal: () => `共?{total.value} 条`
}))

const updateArticle = (article_id: string): void => {
    router.push(`./article/edit/${article_id}`)
}

// 导入功能
const importMarkDown = () => {
    console.log("导入成功");
}

const downMarkDown = () => {
    console.log("导出成功");

}

const openUploadModal = async () => {
    await createSession();
    openUpload.value = true;
}

const beforeUpload = (file: UploadFile) => {
    const allow = /\.(png|jpe?g|md)$/i.test(file.name);
    if (!allow) {
        filteredCount.value += 1;
        return Upload.LIST_IGNORE;
    }
    return false;
}


const submitFile = async () => {
    session.value

    console.log(fileList.value);
    /**
     * step0: 将文件转存为has Map <url , str>
     * step1: 先判断是否为md
     * step2: 抽取md中的图片的相对路径
     * step3: 判断has map 中是否有相对路径的文件
     * step4：进行分组，将附件图片与md作为一组上传 || 无图片附件的md 以10个为单位上传
     */

    const url_file_map = new Map<string, UploadFile>()
    const map_error: Array<string> = []
    // 图片map 用于分组
    const img_map = new Map<string, UploadFile>();
    // 怎么感觉这么写损耗性能，无所谓了
    fileList.value?.forEach((file: UploadFile) => {
        const path = file.originFileObj?.webkitRelativePath
        if (path) {
            url_file_map.set(path, file);
            if (isImageFile(file)) img_map.set(path, file);
        }
        else {
            map_error.push(`文件${file.name}获取相对路径失败`)
        }
    });
    if (map_error.length > 0) message.warn(map_error.join('\n'));

    // 二维数组 分组
    const group_array: Array<UploadFile[]> = []

    // 记录索引

    // 图片分组游标
    let img_index = 0;
    // md分组游标
    let md_index = 0;

    fileList.value?.forEach(async (file: UploadFile) => {
        if (!isMdFile(file)) {
            return;
        }

        const md = await readMdFromFileList(file)
        if (!md) return;

        const path = extractImagePaths(md.mdText);
        // 图片与md分组 可能丢失图片文件,无所谓了不考虑后续再做
        // TODO: 上传图片丢失
        if (path.length > 0) {

            img_index > md_index ? img_index++ : img_index = md_index + 1;   

            if(!group_array[img_index]) {
                group_array[img_index] = []
            }

            group_array[img_index]?.push(file);

            return path.forEach(url => {
                if (img_map.has(url)) group_array[img_index]?.push(img_map.get(url) as UploadFile);
            })
        }

        let md_group_item = group_array[md_index]

        if (!md_group_item) {
            group_array[md_index] = [];
            md_group_item = group_array[md_index]
        }

        // 超出分组游标加一
        if (md_group_item && md_group_item.length >= GROUP_COUNT) {
            md_index++;
            group_array.push([]);
        }
        group_array[md_index]?.push(file);
    })
    // 测试一下
    console.log(group_array);
    
    console.log('this is session ', session);

    console.log('这里执行提交了');
}


onMounted(async () => {
    await fetchList()
})
tableHeightOnMounted('main-content', 'toobar')
const computTableHeight = computed(() => tableHeight.value)

</script>

<style scoped lang="scss">
.center-article {}

.submit-button {
    margin-top: 20px;
}
</style>
