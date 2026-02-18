import { config } from "@/config/local.env";

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