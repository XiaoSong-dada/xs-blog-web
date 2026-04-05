import { config } from "@/config/config";
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
      // 查看url是否以静态前缀开头（支持有/或无/的情况），若是则拼接后端地址
    if (url) {
      const trimmed = url.trim();
      const rawPrefix = (config.VITE_BACKEND_STATIC || "static").toString().trim();
      const prefix = rawPrefix.replace(/^\/+/, "");
      const normalizedUrl = trimmed.replace(/^\/+/, "");

      const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(`^/?${escapeRegExp(prefix)}(?:/|$)`);
      if (prefix && re.test(trimmed)) {
        const baseUrl = (config.VITE_BACKEND_BASE_URL || "").toString().replace(/\/+$/, "");
        console.log(baseUrl);
        console.log(`${baseUrl}/${normalizedUrl} ` + ` /${normalizedUrl}`);
        
        return baseUrl ? `${baseUrl}/${normalizedUrl}` : `/${normalizedUrl}`;
      }
    }

    return resolveStaticAssetUrl(url, config.VITE_STATIC_URL || "");
  };

  return {
    computeImageUrl,
  };
};