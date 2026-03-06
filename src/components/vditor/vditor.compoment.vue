<template>
    <div class="article-editor">
        <!-- 顶部工具栏：标题 + 操作按钮 -->
        <div class="toolbar flex-between">
            <div class="flex-start gap-12 " >
                <div>
                    <a-input class="title" v-model:value="form.title" size="large" :maxlength="40" show-count
                        @change="titleChange" placeholder="请输入文章标题" @pressEnter="onPublish" />
                </div>


                <div class="flex-start">
                    <a-input-group compact>
                        <a-input class="slug" v-model:value="form.slug" size="large" :maxlength="120" show-count
                            placeholder="请输入文章标识" @pressEnter="onPublish" />
                        <a-button :icon="h(RedoOutlined)" @click="reDoSlug"></a-button>
                    </a-input-group>
                </div>

                <slot name="toolbar"></slot>

                <div class="toolbar-actions">
                    <a-tag v-if="lastSavedAt" color="blue">
                        上次保存：{{ lastSavedAt }}
                    </a-tag>

                    <a-button :loading="saving" @click="onSaveDraft">
                        保存草稿
                    </a-button>

                    <a-button type="primary" :loading="publishing" @click="onPublish">
                        发布
                    </a-button>
                </div>
            </div>
            <div>
                <a-button @click="goBack" type="primary">
                    <ArrowLeftOutlined />
                    返回文章列表
                </a-button>
            </div>

        </div>

        <!-- Vditor 容器 -->
        <div class="editor-wrap">
            <div :id="editorId" class="editor"></div>
        </div>

        <!-- 底部状态栏 -->
        <div class="statusbar">
            <div class="left">
                <a-typography-text type="secondary">
                    {{ modeText }} · {{ wordCountText }}
                </a-typography-text>
            </div>
            <div class="right">
                <a-typography-text type="secondary">
                    Ctrl/⌘ + S 保存草稿
                </a-typography-text>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch, h } from "vue";
import { message, Input, Tag, TypographyText, Button, InputGroup } from "ant-design-vue";
import Vditor from "vditor";
import "vditor/dist/index.css";
import type { Props, ArticlePayload } from '@/types/vditor';
import { convertToPinyin } from "@/utils/pinyin";
import type { ChangeEvent } from "ant-design-vue/es/_util/EventInterface";
import { RedoOutlined, ArrowLeftOutlined } from '@ant-design/icons-vue'
import { AuthService } from "@/service/auth.service";
import { config } from '@/config/local.env'

const AInput = Input;
const ATag = Tag;
const ATypographyText = TypographyText;
const AButton = Button;
const AInputGroup = InputGroup;

const props = withDefaults(defineProps<Props>(), {
    mode: "create",
    autosave: true,
    autosaveIntervalMs: 30_000,
    warnOnLeave: true,
    vditorMode: "ir",
    placeholder: "开始写作吧…",
    uploadFieldName: "file",
    enableOutline: true,
    outlinePosition: 'left',
    uploadType: 'attachment',
    initial: () => ({
        title: '',
        slug: '',
        content_md: ''
    }),
});



const emit = defineEmits<{
    /**
     * 保存草稿：由父组件决定调用什么接口
     * 编辑器只负责吐出 payload
     */
    (e: "saveDraft", payload: ArticlePayload): Promise<void> | void;

    /**
     * 发布：由父组件决定接口与跳转
     */
    (e: "publish", payload: ArticlePayload): Promise<void> | void;

    /**
     * 内容有变化：父组件可用来做“是否启用按钮、是否提示”等
     */
    (e: "change", payload: ArticlePayload): void;

    /**
     * 第一次保存草稿后，就是编辑草稿所以应启用编辑草稿对应的结构
     */

    (e: "editDraft", payload: ArticlePayload): Promise<void> | void;

    /**
     * 保存状态监听
     */
    (e: "isDirty", dirty: boolean): Promise<void> | void;

    /**
     * 返回文章列表
     */
    (e: "goBack"): void;
}>();

/** ---------------------------
 * 1) 表单状态（标题/摘要 + 编辑器内容）
 * -------------------------- */
const form = reactive({
    title: props.initial?.title ?? "",
    slug: props.initial?.slug ?? "",
});

// vditor 实例
const vditor = ref<Vditor | null>(null);

// 编辑器 DOM id（避免多实例冲突）
const editorId = `vditor-${Math.random().toString(36).slice(2)}`;

// 状态
const saving = ref(false);
const publishing = ref(false);
const dirty = ref(false); // 是否有未保存修改
const lastSavedAt = ref<string>("");
const isVditorReady = ref(false);
const pendingMarkdown = ref<string | null>(null);
const hydratingFromInitial = ref(false);


// 统计
const wordCount = ref(0);

const modeText = computed(() => (props.mode === "edit" ? "编辑文章" : "新建文章"));
const wordCountText = computed(() => `字数：${wordCount.value}`);

/** ---------------------------
 * 2) 生成 payload（对外输出的标准结构）
 * -------------------------- */
function getMarkdown(): string {
    if (!isVditorReady.value || !vditor.value) return pendingMarkdown.value ?? "";
    return vditor.value?.getValue() ?? "";
}

function buildPayload(): ArticlePayload {
    return {
        title: form.title.trim(),
        slug: form.slug?.trim() || "",
        content_md: getMarkdown(),
    };
}

function syncFromInitial(initial?: Partial<ArticlePayload>) {
    hydratingFromInitial.value = true;

    form.title = initial?.title ?? "";
    form.slug = initial?.slug ?? "";

    const nextMarkdown = initial?.content_md ?? "";
    pendingMarkdown.value = nextMarkdown;

    if (isVditorReady.value && vditor.value) {
        const currentMarkdown = vditor.value.getValue() ?? "";
        if (currentMarkdown !== nextMarkdown) {
            vditor.value.setValue(nextMarkdown);
        }
    }

    Promise.resolve().then(() => {
        hydratingFromInitial.value = false;
    });
}


/** ---------------------------
 * 3) 基础校验（编辑器组件只做最基本的校验）
 * -------------------------- */
function validateBeforeSubmit(payload: ArticlePayload): boolean {
    if (!payload.title) {
        message.warning("请输入文章标题");
        return false;
    }
    if (!payload.slug) {
        message.warning("请输入文章slug");
        return false;
    }

    if (!payload.content_md.trim()) {
        message.warning("文章内容不能为空");
        return false;
    }

    return true;
}

/** ---------------------------
 * 4) 保存/发布：只负责状态控制 + emit，把“业务接口”交给父组件
 * -------------------------- */
async function onSaveDraft() {
    const payload = buildPayload();
    if (!payload.title && !payload.content_md.trim()) {
        message.info("还没有内容需要保存");
        return;
    }

    try {
        saving.value = true;

        if (props.mode === 'create') {
            await emit("saveDraft", payload);
        }
        else {
            await emit("editDraft", payload)
        }

        dirty.value = false;
        lastSavedAt.value = new Date().toLocaleString();
    } catch (e) {
        message.error("保存失败，请重试");
    } finally {
        saving.value = false;
    }
}

async function onPublish() {
    const payload = buildPayload();
    if (!validateBeforeSubmit(payload)) return;
    // 未保存时不允许发布
    if (dirty.value) return message.info('文章还未保存');

    try {
        publishing.value = true;
        await emit("publish", payload);
        dirty.value = false;
    } catch (e) {
        message.error("发布失败，请重试");
    } finally {
        publishing.value = false;
    }
}

/** ---------------------------
 * 5) 初始化 Vditor（Vue3 正确生命周期）
 * -------------------------- */
function initVditor() {
    vditor.value = new Vditor(editorId, {
        height: "100%",
        mode: props.vditorMode,
        placeholder: props.placeholder,
        cdn: config.VITE_VDITOR_CDN,
        lang: "zh_CN",

        // 不建议用 Vditor 自带 cache（可控性弱），我们用自己的 autosave
        cache: { enable: false },

        // 字数统计：用于底部 statusbar
        counter: {
            enable: true,
            after: (count: number) => {
                wordCount.value = count;
            },
        },
        fullscreen: {
            index: 2000
        },

        // 大纲默认展开
        outline: {
            enable: props.enableOutline,
            position: props.outlinePosition
        },

        // 工具栏保持默认即可；想精简以后再做
        // toolbar: [...],

        // 图片上传（可选：你接上传接口时再打开）
        ...(props.uploadUrl
            ? {
                upload: {
                    url: props.uploadUrl,
                    fieldName: props.uploadFieldName,
                    extraData: {
                        bucket: props.uploadType, // "markdown" | "image" | "attachment"
                    },
                    headers: {
                        Authorization: `Bearer ${AuthService.getToken()}`,
                    },
                    // 把后端返回格式转成 Vditor 期望的结构
                    format: (_files, responseText) => {
                        try {
                            const response = JSON.parse(responseText);
                            const storedPath = response?.data?.stored_path;
                            if (response?.code === 200 && storedPath) {
                                const originalName = response?.data?.original_name || "file";
                                const staticBase = config.VITE_STATIC_URL
                                const normalizedPath = storedPath.startsWith("/") ? storedPath.slice(1) : storedPath;
                                const url = storedPath.startsWith("http")
                                    ? storedPath
                                    : `${staticBase.replace(/\/$/, "")}/${normalizedPath}`;
                                return JSON.stringify({
                                    code: 0,
                                    msg: response?.message || "ok",
                                    data: {
                                        succMap: {
                                            [originalName]: url,
                                        },
                                        errFiles: [],
                                    },
                                });
                            }
                        } catch (_e) {
                            // fall through and return original response text
                        }
                        return responseText;
                    },
                    // 注意：format 要按你后端返回结构适配
                    // format: (files, responseText) => { ... }
                },
            }
            : {}),

        // 初始化完成回填内容（编辑模式）
        after: () => {
            isVditorReady.value = true;
            const initMd = pendingMarkdown.value ?? props.initial?.content_md ?? "";
            vditor.value?.setValue(initMd);
            pendingMarkdown.value = null;
        },
    });
}

/** ---------------------------
 * 6) 变更监听：dirty + 向父组件派发 change（方便父页面做按钮状态/离开提示）
 * -------------------------- */
function markDirtyAndNotify() {
    dirty.value = true;
    emit("change", buildPayload());
}

const titleChange = (e: ChangeEvent) => {
    if (e.target.value) form.slug = convertToPinyin(e.target.value)
    else form.slug = ''
}

const reDoSlug = () => {
    if (form.title) {
        form.slug = convertToPinyin(form.title)
    }
    else {
        form.slug = ''
    }
}

/**
 * Vditor 没有直接给 Vue 的 v-model，
 * 这里用轮询或输入事件监听都可以。
 * 轮询会更通用（但更费），事件监听更优雅。
 *
 * Vditor 提供 input 回调（不同版本参数略有差异），这里用一个稳妥方式：
 * 在 autosave tick 和快捷键保存时都会 buildPayload，不会丢数据。
 * 同时我们用 watch 监听标题/摘要变化。
 */
watch(
    () => [form.title, form.slug],
    () => {
        if (hydratingFromInitial.value) return;
        markDirtyAndNotify();
    }
);

watch(dirty, () => {
    // 当保存状态更新时，及时通知父组件
    emit('isDirty', dirty.value)
})

watch(
    () => [props.initial?.title, props.initial?.slug, props.initial?.content_md],
    () => {
        syncFromInitial(props.initial);
    },
    { immediate: true }
);


/** ---------------------------
 * 7) 自动保存 + 快捷键 Ctrl/⌘+S（工程化写法）
 * -------------------------- */
let autosaveTimer: number | undefined;

function startAutosave() {
    if (!props.autosave) return;
    autosaveTimer = window.setInterval(async () => {
        if (!dirty.value) return;
        // 自动保存走草稿
        await onSaveDraft();
    }, props.autosaveIntervalMs);
}

function stopAutosave() {
    if (autosaveTimer) window.clearInterval(autosaveTimer);
    autosaveTimer = undefined;
}

function onKeydown(e: KeyboardEvent) {
    const isSave = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s";
    const isPublsih = e.ctrlKey && e.altKey && e.key === 'Enter';
    if (isSave || isPublsih) e.preventDefault();
    if (isSave) onSaveDraft();
    else if (isPublsih) onPublish();
    else return;
}

/** ---------------------------
 * 8) 离开页面提示（可选，但很工程化）
 * -------------------------- */
function setupBeforeUnloadWarn() {
    if (!props.warnOnLeave) return;

    const handler = (e: BeforeUnloadEvent) => {
        if (!dirty.value) return;
        e.preventDefault();
        e.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);

    return () => window.removeEventListener("beforeunload", handler);
}

let cleanupBeforeUnload: (() => void) | undefined;

const goBack = ()=>{
    emit("goBack");
}

onMounted(() => {
    initVditor();
    startAutosave();
    window.addEventListener("keydown", onKeydown);
    cleanupBeforeUnload = setupBeforeUnloadWarn();
});

onBeforeUnmount(() => {
    stopAutosave();
    window.removeEventListener("keydown", onKeydown);
    cleanupBeforeUnload?.();
    vditor.value?.destroy();
    vditor.value = null;
    isVditorReady.value = false;
    pendingMarkdown.value = null;
});
</script>

<style scoped lang="scss">
.article-editor {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;

    .toolbar {
        display: flex;
        gap: 12px;
        align-items: center;

        .title,
        .slug {
            height: 32px;

        }

        .title {
            width: 240px;
        }

        .slug {
            width: 360px;
        }


    }

    :deep(.ant-input-group-compact .ant-input) {
        border-right: none;
    }

    .toolbar-actions {
        display: flex;
        gap: 8px;
        align-items: center;
        flex-shrink: 0;
    }

    .meta {
        display: block;
    }

    .editor-wrap {
        flex: 1;
        min-height: 480px;
        border: 1px solid #f0f0f0;
        border-radius: 8px;
        overflow: hidden;
    }

    /* vditor 自己会撑满容器，但容器必须有高度 */
    .editor {
        height: 100%;
    }

    .statusbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .gap-12 {
        gap: 12px;
    }

}
</style>
