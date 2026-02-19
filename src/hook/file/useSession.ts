import type { IUplaodSession, IUploadGroup, IUploadResult } from "@/types/main"
import { ref, createVNode } from "vue"
import { createSession as create, uploadSession as upload, commitSession as commit } from "@/api/file/file";
import type { ApiResponse } from '@/types/http';
import { message, type UploadFile, Modal, Progress } from 'ant-design-vue';
import { withLock } from "@/utils/request.lock";
import { ConcurrencyPool } from "@/utils/concurrency";

const IMAGE_MIME_PREFIX = 'image/';

export function isImageFile(file: UploadFile): boolean {
    // 1️⃣ 优先用浏览器识别的 MIME
    const mime = file.type || file.originFileObj?.type;
    if (mime?.startsWith(IMAGE_MIME_PREFIX)) {
        return true;
    }

    // 2️⃣ 兜底：文件名后缀
    const name = file.name ?? '';
    return /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(name);
}

function extractImagePaths(mdText: string): string[] {
    const results: string[] = [];
    const re = /!\[[^\]]*]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
    let m: RegExpExecArray | null;

    while ((m = re.exec(mdText)) !== null) {
        const content = m[1] as string
        const raw = content.trim();
        // 过滤网络图（http/https/data）
        if (/^(https?:|data:)/i.test(raw)) continue;
        results.push(raw);
    }
    return Array.from(new Set(results));
}

function isMdFile(f: UploadFile) {
    return /\.md$/i.test(f.name ?? '');
}

async function readMdFromFileList(fileRead: UploadFile) {
    if (!isMdFile(fileRead)) return;
    const mdItem = fileRead;
    const file = mdItem.originFileObj as File | undefined;
    if (!file) throw new Error('md 文件还没有拿到 originFileObj（可能被处理过或格式不对）');

    const mdText = await file.text(); // ✅ 读取文本
    return { mdText, mdName: mdItem.name };
}


export const useSession = () => {
    const session = ref<IUplaodSession>();
    const upload_result = ref();
    const createSession = async () => {
        const res: ApiResponse<IUplaodSession> = await create();
        if (res.code === 200) session.value = res.data;
        else message.error('创建session失败!');
    }

    /**
      * @param groups IUploadGroup[]：每组可能包含多个 UploadFile（md + images）
      * @param opts.concurrency 并发数建议 3~5
      * @param opts.onProgress (done,total) 进度回调，可选
      */
    const uploadSession = async (
        id: string,
        groups: IUploadGroup[],
        opts?: { concurrency?: number; onProgress?: (done: number, total: number) => void }
    ): Promise<IUploadResult> => {
        const concurrency = Math.max(1, opts?.concurrency ?? 3)
        const pool = new ConcurrencyPool(concurrency)

        const total = groups.length
        let done = 0
        // 添加进度条：使用数字 percent，避免传 ref 对象导致 [object Object]%
        let percent = 0
        const modalRef = Modal.info({
            title: '正在上传文件',
            content: createVNode(Progress, { percent }),
            okButtonProps: { disabled: true },
        })


        const tasks = groups.map((group, index) =>
            pool.run(async () => {
                try {
                    const res: ApiResponse<IUploadResult> = await upload(id, group)
                    console.log('这是上传结果: ', res);

                    // 你根据后端返回结构适配一下：
                    // 如果 upload 接口返回 { code, data: { uploaded:[], errors:[] } }
                    if (res.code !== 200) {
                        const names = group.file_array?.map(f => f.name).filter(Boolean)
                        return { ok: false as const, error: `第${index + 1}组上传失败(code=${res.code})`, names }
                    }

                    return { ok: true as const, data: res.data }
                } catch (e: any) {
                    const names = group.file_array?.map(f => f.name).filter(Boolean)
                    return { ok: false as const, error: e?.message ?? "网络错误", names }
                } finally {
                    done++
                    // 更新外部回调和模态框中的进度条
                    opts?.onProgress?.(done, total)
                    percent = total > 0 ? Math.round((done / total) * 100) : 100
                    modalRef.update({
                        content: createVNode(Progress, { percent })
                    })
                }
            })
        )

        const settled = await Promise.all(tasks)

        // 汇总
        const result: IUploadResult = { uploaded: [], errors: [] }
        for (const item of settled) {
            if (item.ok) {
                result.uploaded.push(...(item.data?.uploaded ?? []))
                if (item.data?.errors?.length) result.errors.push(...item.data.errors)
            } else {
                const prefix = item.names?.length ? `[${item.names.join(", ")}] ` : ""
                result.errors.push(prefix + item.error)
            }
        }

        modalRef.destroy()
        upload_result.value = result
        return result
    }

    const commitSession = async (session_id: string) => {
        return await commit(session_id)
    }
    return {
        createSession,
        session,
        uploadSession: (id: string, groups: IUploadGroup[], opts?: { concurrency?: number; onProgress?: (done: number, total: number) => void }) =>
            withLock(`upload-session:${id}`, () => uploadSession(id, groups, opts)),
        commitSession
    }
}

export const useFiles = () => {
    return {
        extractImagePaths,
        isMdFile,
        readMdFromFileList,
        isImageFile
    }
}