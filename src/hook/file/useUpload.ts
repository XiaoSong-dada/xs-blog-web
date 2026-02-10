import { uploadFile as upload } from "@/api/file/file"
import { config } from "@/config/local.env"
import { message } from "ant-design-vue"



export const useUplaodImgFile = ()=>{
    const uploadFile =async (file:File)=>{
        const res = await upload(file, 'image')
        if(res.code === 200 )message.success('上传成功');
        else message.error('上传失败'+res.message);
        return res
    }
    return {
        uploadFile
    }
}

export const useComputedUrl = () => {
  const computeImageUrl = (url?: string | null) => {
    if (!url) return "";

    // 已经是完整 URL（http / https / blob）
    if (/^(https?:)?\/\//.test(url) || url.startsWith("blob:")) {
      return url;
    }

    // 本地资源（如 /src/assets）
    if (url.startsWith("@/") || url.startsWith("/assets")) {
      return url;
    }

    // 服务器相对路径
    return `${config.VITE_STATIC_URL}${url}`;
  };

  return {
    computeImageUrl,
  };
};