import type { ApiResponse } from "@/types/http";
import type { IArticle, IUplaodSession } from "@/types/main";
import { ref, h, type VNode } from "vue";
import { createSession as create, downloadFile, exportCommitSession } from "@/api/file/file";
import { message, Modal } from "ant-design-vue";
import { isNull } from "@/utils/verification";



export const useDownload = () => {
    const session = ref<IUplaodSession>();
    const createSession = async () => {
        const res: ApiResponse<IUplaodSession> = await create();
        if (res.code === 200) session.value = res.data;
        else message.error('创建session失败!');
    }
    const url = ref<string>();

    const downLoad = () => {
        const modal = Modal.confirm({
            title: "确认下载",
            content: h('div', {}, [h('p', `是否确认下载文章`)]),
            okText: '确认',
            cancelText: "取消",
            onOk: async () => {
                if (!url.value) {
                    message.error('下载链接不存在!');
                    return;
                }

                try {
                    const blob = await downloadFile(url.value);
                    const objectUrl = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = objectUrl;
                    link.download = 'articles.zip'; // 或者你用后端返回的文件名
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    setTimeout(() => {
                        window.URL.revokeObjectURL(objectUrl);
                    }, 1500);
                } catch (e: any) {
                    message.error(`下载失败：${e?.message ?? String(e)}`);
                } finally {
                    modal.destroy();
                }
            },
            onCancel: () => modal.destroy(),
        });
    };
    const downloadArticlesAsNarkdown = (selectedRows: IArticle[]) => {

        if ((!selectedRows) || selectedRows.length === 0) return message.info("请选择一行文章!");

        const id: string[] = []
        const message_array: VNode[] = [];
        message_array.push(h('p', `是否确认导出文章`));
        selectedRows?.forEach(item => {
            message_array.push(h('p', `文章标题:《${item.title}》`));
            id.push(item.id);
        })
        const modal = Modal.confirm(
            {
                title: "导出确认",
                content: h('div', {}, [
                    ...message_array
                ]),
                okText: '确认',
                onOk: async () => {
                    if (!session.value) {
                        message.error('下载会话不存在，请重新创建!');
                        return;
                    }
                    const res = await exportCommitSession(session.value.session_id, id)

                    if (res.code === 200 && res.data && isNull(res.data?.download_url) === false) {
                        message.success('导出成功');
                        url.value = res.data.download_url;
                        downLoad();
                    } else {
                        message.error('导出失败' + (res.message || ''));
                    }

                },
                cancelText: "取消",
                onCancel: () => {
                    modal.destroy();
                }
            }
        )
    }
    return {
        downloadSession: session,
        createDownloadSession: createSession,
        downloadArticlesAsNarkdown
    }
}