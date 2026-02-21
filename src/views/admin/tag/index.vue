<template>
    <div class="tag-admin">
        <div class="toobar">
            <a-flex class="header" :gap="40">
                <a-flex gap="small">
                    <a-flex class="search-item">
                        <text>名称：</text>
                        <div class="flex-center flex-column">
                            <a-input class="toolbar-input" v-model:value="params.name" />
                        </div>
                    </a-flex>
                    <a-flex class="search-item">
                        <text>标记：</text>
                        <div class="flex-center flex-column">
                            <a-input class="toolbar-input" v-model:value="params.slug" />
                        </div>
                    </a-flex>
                </a-flex>
                <a-flex gap="small" align="center">
                    <a-button type="primary" :icon="h(SearchOutlined)" @click="onSearch">搜索</a-button>
                    <a-button :icon="h(SyncOutlined)" @click="onReset">重置</a-button>
                </a-flex>
            </a-flex>

            <a-flex class="tools" gap="small">
                <a-button type="primary" :icon="h(PlusOutlined)" @click="add">
                    新增
                </a-button>
            </a-flex>
        </div>

        <a-table
            :columns="columns"
            :data-source="data"
            :scroll="{ x: '100%', y: computTableHeight }"
            :loading="loading"
            :pagination="paginationComputed"
            :row-selection="rowSelection"
            row-key="id"
        >
            <template #bodyCell="{ column, record, index }">
                <template v-if="column.key === 'index'">
                    {{ buildIndex(params, index) }}
                </template>

                <template v-if="column.key === 'created_at'">
                    {{ record.created_at ? formatDate(record.created_at) : '' }}
                </template>

                <template v-if="column.key === 'action'">
                    <a-button type="link" :icon="h(EditOutlined)" @click="update(record.id)">修改</a-button>
                    <a-popconfirm
                        :title="`是否确认删除标签 ${record.name}`"
                        ok-text="确认"
                        cancel-text="取消"
                        @confirm="() => remove(record.id)"
                    >
                        <a-button type="link" danger :icon="h(DeleteOutlined)">删除</a-button>
                    </a-popconfirm>
                </template>
            </template>
        </a-table>

        <a-modal v-model:open="modalOpen" :title="title" okText="确认" cancelText="取消" @ok="submit" @cancel="cancel">
            <a-form :model="formModel" labelAlign="right" :labelCol="{ span: 4 }" name="tag_form" autocomplete="off">
                <a-form-item label="名称" v-bind="validateInfos.name">
                    <a-input v-model:value="formModel.name" />
                </a-form-item>
                <a-form-item label="标记" v-bind="validateInfos.slug">
                    <a-input v-model:value="formModel.slug" />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import { Table, Button, Flex, Input, Popconfirm, Modal, Form } from 'ant-design-vue';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, SyncOutlined } from '@ant-design/icons-vue';
import { computed, h, onMounted } from 'vue';

import { useBuildTableIndex } from '@/hook/useBuilding';
import { useTableHeight } from '@/hook/layout/useLayout';
import { formatDate } from '@/utils/date';
import { useAddTag, useDeleteTag, useTagList, useTagModal, useUpdateTag } from '@/hook/tag/useTag';

const ATable = Table;
const AButton = Button;
const AFlex = Flex;
const AInput = Input;
const APopconfirm = Popconfirm;
const AModal = Modal;
const AForm = Form;
const AFormItem = Form.Item;

const { columns, params, data, total, loading, fetchList, resetParams, rowSelection } = useTagList();
const { modalOpen, submit, cancel, title, formModel, validateInfos } = useTagModal();
const { add } = useAddTag();
const { update } = useUpdateTag();
const { remove } = useDeleteTag();
const { buildIndex } = useBuildTableIndex();
const { tableHeight, tableHeightOnMounted } = useTableHeight();

const onSearch = () => {
    params.value.offset = 1;
    fetchList();
};

const onReset = () => {
    resetParams();
    fetchList();
};

const onTableChange = (page: number, pageSize: number) => {
    params.value.offset = page;
    params.value.limit = pageSize;
    fetchList();
};

const paginationComputed = computed(() => ({
    current: params.value.offset || 1,
    pageSize: params.value.limit || 10,
    total: total.value,
    showSizeChanger: true,
    onChange: onTableChange,
    onShowSizeChange: onTableChange,
    showTotal: () => `共${total.value} 条`,
}));

onMounted(async () => {
    await fetchList();
});

tableHeightOnMounted();
const computTableHeight = computed(() => tableHeight.value);
</script>

<style scoped lang="scss">
.tag-admin {
    .toolbar {
        &-input {
            width: 180px;
        }
    }
}
</style>
