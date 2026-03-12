import { config } from "@/config/local.env";
import { resolveStaticAssetUrl } from "@/utils/url";

/**
 * 资源地址计算钩子。
 * 将数据库中的相对路径统一转换为可访问的图片地址。
 */
export const useComputedUrl = () => {
  /**
   * 计算图片可访问地址。
   * @param url 原始图片地址
   */
  const computeImageUrl = (url?: string | null) => {
    
    // 查看url是否为static开头如果是static开头就只需要拼接VITE_BACKEND_BASE_URL和url即可
    if (url && url.trim().startsWith(config.VITE_BACKEND_STATIC || "static")) {
      const baseUrl = config.VITE_BACKEND_BASE_URL || "";
      return `${baseUrl}/${url.trim()}`;
    }
    return resolveStaticAssetUrl(url, config.VITE_STATIC_URL || "");
  };

  return {
    computeImageUrl,
  };
};