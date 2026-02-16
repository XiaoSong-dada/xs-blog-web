<template>
    <div class="friend-link">
        <div class="toobar">
            <a-flex class="header" :gap="40">
                <a-flex gap="small">
                    <a-flex class="search-item">
                        <text>
                            名称：
                        </text>
                        <div class="flex-center flex-column">
                            <a-input class="toolbar-input" v-model:value="params.name" />
                        </div>
                    </a-flex>
                </a-flex>
                <a-flex gap="small" align="center">
                    <a-button type="primary" :icon="h(SearchOutlined)" @click="onSearch">搜索</a-button>
                    <a-button :icon="h(SyncOutlined)" @click="onReset">重置</a-button>
                </a-flex>
            </a-flex>
            <a-flex class="tools" gap="small">
                <a-button type="primary" :icon="h(PlusOutlined)" @click="addLink">
                    新增
                </a-button>
            </a-flex>
        </div>
        <a-table :columns="columns" :data-source="data" :scroll="{ x: '100%', y: computTableHeight }" :loading="loading"
            :pagination="paginationComputed" :row-selection="rowSelection" row-key="id">
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
                    <a-button type="link" :icon="h(EditOutlined)" @click="updateLink(record.id)">修改</a-button>
                    <a-popconfirm :title="`是否确认删除删除连接${record.name}`" ok-text="确认" cancel-text="取消"
                        @confirm="() => delteLink(record.id)">
                        <a-button type="link" danger :icon="h(DeleteOutlined)">删除</a-button>
                    </a-popconfirm>
                </template>
            </template>
        </a-table>

        <a-modal v-model:open="modalOpen" :title="title" okText="确认" cancelText="取消" @ok="submit" @cancel="cancel">
            <a-from :model="formModel" labelAlign="right" :labelCol="{ span: 3 }" name="friend_link" autocomplete="off">
                <a-from-item label="名称" v-bind="validateInfos.name">
                    <a-input v-model:value="formModel.name" />
                </a-from-item>
                <a-from-item label="地址" name="url" v-bind="validateInfos.url">
                    <a-input v-model:value="formModel.url" />
                </a-from-item>
                <a-from-item label="介绍" name="description">
                    <a-text-area v-model:value="formModel.description" :rows="4" />
                </a-from-item>
            </a-from>
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import { Table, Button, Flex, Input, Popconfirm, Modal, Form, Textarea } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import {
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    SyncOutlined,
} from '@ant-design/icons-vue';
import { computed, h, onMounted } from 'vue'
import { formatDate } from '@/utils/date';
import { useBuildTableIndex } from '@/hook/useBuilding';
import { useTableHeight } from '@/hook/layout/useLayout';
import { omitString } from '@/utils/utils';
import { useAddFriendLink, useDelteFriendLink, useFriendLinkList, useFriendLinkModal, useUpdateFriendLink } from '@/hook/link/useFriendLink';

const ATable = Table;
const AButton = Button;
const AFlex = Flex;
const AInput = Input;
const ATextArea = Textarea;
const APopconfirm = Popconfirm;
const AModal = Modal;
const AFrom = Form;
const AFromItem = Form.Item

const { columns, params, data, total, loading, fetchList, resetParams, rowSelection } = useFriendLinkList();
const { buildIndex } = useBuildTableIndex();
const { tableHeight, tableHeightOnMounted } = useTableHeight();
const { updateLink } = useUpdateFriendLink();
const { addLink } = useAddFriendLink();
const { modalOpen, submit, cancel, title, formModel, validateInfos } = useFriendLinkModal();
const { delteLink } = useDelteFriendLink();
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
    showTotal: () => `共${total.value} 条`
}))


onMounted(async () => {
    await fetchList()
})
tableHeightOnMounted()
const computTableHeight = computed(() => tableHeight.value)

</script>

<style scoped lang="scss">
.friend-link {
    .toolbar {
        &-input {
            width: 180px;
        }
    }

    .area {
        min-height: 400px;
    }

}

.submit-button {
    margin-top: 20px;

}
</style>
