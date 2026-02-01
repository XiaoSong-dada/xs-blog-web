/**
 * 你项目里的文章模型可以自己替换
 * 这里保持“编辑器组件”和“后端字段”弱耦合
 */
export interface ArticlePayload {
    title: string;
    slug: string;
    content_md: string;
    content_html: string;
};

export interface Props {
    /**
     * create: 新建
     * edit: 编辑
     */
    mode?: "create" | "edit";

    /**
     * 编辑时传入初始内容（从后端 get article 得到）
     * create 模式可以不传
     */
    initial?: Partial<ArticlePayload>;

    /**
     * 自动保存草稿：默认开启
     * intervalMs：自动保存间隔
     */
    autosave?: boolean;
    autosaveIntervalMs?: number;

    /**
     * 当内容有变更，离开页面前提示
     */
    warnOnLeave?: boolean;

    /**
     * Vditor 模式：sv 分屏（推荐博客），ir 类 Typora，wysiwyg 所见即所得
     */
    vditorMode?: "sv" | "ir" | "wysiwyg";

    /**
     * 占位文案
     */
    placeholder?: string;

    /**
     * 是否默认展开大纲
     */
    enableOutline?: boolean;

    /**
     * 大纲位置
     */
    outlinePosition?: 'left' | 'right';

    /**
     * 图片上传（可选：你后面接上传接口时再启用）
     * 这里先预留参数位，工程上更容易扩展
     */
    uploadUrl?: string;
    uploadFieldName?: string;
    uploadType?:string
};