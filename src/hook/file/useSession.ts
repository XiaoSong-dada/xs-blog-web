import type { IUplaodSession } from "@/types/main"
import { ref } from "vue"
import { createSession as create } from "@/api/file/file";
import type { ApiResponse } from '@/types/http';
import { message, type UploadFile } from 'ant-design-vue';


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
    if(!isMdFile(fileRead))return;
    const mdItem = fileRead;
    const file = mdItem.originFileObj as File | undefined;
    if (!file) throw new Error('md 文件还没有拿到 originFileObj（可能被处理过或格式不对）');

    const mdText = await file.text(); // ✅ 读取文本
    return { mdText, mdName: mdItem.name };
}


export const useSession = () => {
    const session = ref<IUplaodSession>();
    const createSession = async () => {
        const res: ApiResponse<IUplaodSession> = await create();
        if (res.code === 200) session.value = res.data;
        else message.error('创建session失败!');
    }
    return {
        createSession,
        session,
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