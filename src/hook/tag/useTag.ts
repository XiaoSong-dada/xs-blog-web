import { computed, reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import { useForm } from 'ant-design-vue/es/form';

import type { ITag, ITagForm, ITagQuery } from '@/types/main';
import { useBuildQueryParams } from '@/hook/useBuilding';
import { addTag, deleteTag, getTagDetail, getTagList, updateTag } from '@/api/tag/tag';

const buildQueryParams = useBuildQueryParams;

const columns = [
    { title: '序号', key: 'index', dataIndex: 'index', width: '80px' },
    { title: '标签名称', key: 'name', dataIndex: 'name', width: '220px' },
    { title: '标签标记', key: 'slug', dataIndex: 'slug', width: '220px' },
    { title: '创建时间', key: 'created_at', dataIndex: 'created_at', width: '200px' },
    { title: '操作', key: 'action', width: '160px' },
];

const createDefaultParams = (): ITagQuery => ({
    name: '',
    slug: '',
    offset: 1,
    limit: 10,
});

const params = ref<ITagQuery>(createDefaultParams());
const data = ref<ITag[]>([]);
const total = ref(0);
const loading = ref(false);

const selectedRows = ref<ITag[]>();
const selectedRowKeys = ref<(string | number)[]>([]);
const rowSelection = computed(() => ({
    checkStrictly: true,
    selectedRowKeys: selectedRowKeys.value,
    onChange: (keys: (string | number)[], rows: ITag[]) => {
        selectedRowKeys.value = keys;
        selectedRows.value = rows;
    },
}));

const fetchList = async (overrides: Partial<ITagQuery> = {}) => {
    loading.value = true;
    try {
        const query = buildQueryParams({ ...params.value, ...overrides });
        const res = await getTagList(query);
        data.value = res.data ?? [];
        total.value = res.total ?? 0;
    } finally {
        loading.value = false;
    }
};

const resetParams = () => {
    params.value = createDefaultParams();
};

export const useTagList = () => ({
    params,
    data,
    total,
    loading,
    columns,
    rowSelection,
    fetchList,
    resetParams,
});

const modalOpen = ref(false);
const title = ref('');
const isAdd = ref(false);
const currentEditId = ref('');

const formModel = ref<ITagForm>({
    name: '',
    slug: '',
});

const rulesRef = reactive({
    name: [{ required: true, message: '请输入标签名称' }],
    slug: [{ required: true, message: '请输入标签标记' }],
});

const { validateInfos, validate, resetFields } = useForm(formModel, rulesRef);

const cancel = () => {
    modalOpen.value = false;
    isAdd.value = false;
    currentEditId.value = '';
    formModel.value = { name: '', slug: '' };
    resetFields();
};

const submit = async () => {
    await validate();

    if (isAdd.value) {
        const res = await addTag(formModel.value);
        if (res.code !== 201) {
            return message.error(`新增失败: ${res.message}`);
        }
        message.success('新增成功');
    } else {
        const id = currentEditId.value;
        if (!id) {
            return message.error('缺少标签ID');
        }
        const res = await updateTag(id, formModel.value);
        if (res.code !== 200) {
            return message.error(`修改失败: ${res.message}`);
        }
        message.success('修改成功');
    }

    await fetchList();
    cancel();
};

export const useTagModal = () => ({
    modalOpen,
    title,
    formModel,
    validateInfos,
    submit,
    cancel,
});

export const useAddTag = () => {
    const add = () => {
        isAdd.value = true;
        title.value = '新增标签';
        formModel.value = { name: '', slug: '' };
        modalOpen.value = true;
    };

    return { add };
};

export const useUpdateTag = () => {
    const update = async (id: string) => {
        const res = await getTagDetail(id);
        if (res.code !== 200 || !res.data) {
            return message.error(`获取标签详情失败: ${res.message}`);
        }

        isAdd.value = false;
        currentEditId.value = id;
        title.value = '修改标签';
        formModel.value = {
            name: res.data.name,
            slug: res.data.slug,
        };
        modalOpen.value = true;
    };

    return { update };
};

export const useDeleteTag = () => {
    const remove = async (id: string) => {
        const res = await deleteTag(id);
        if (res.code !== 200) {
            return message.error(`删除失败: ${res.message}`);
        }
        message.success('删除成功');
        await fetchList();
    };

    return { remove };
};
