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
    return resolveStaticAssetUrl(url, config.VITE_STATIC_URL || "");
  };

  return {
    computeImageUrl,
  };
};