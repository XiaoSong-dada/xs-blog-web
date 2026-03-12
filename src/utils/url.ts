/**
 * 判断资源地址是否可以直接访问（无需拼接静态域名）。
 * @param url 原始资源地址
 */
export function isDirectUrl(url: string): boolean {
  return /^(https?:)?\/\//.test(url) || url.startsWith("blob:") || url.startsWith("data:")
}

/**
 * 统一计算静态资源完整地址。
 * @param url 资源地址（可能是数据库中的相对路径）
 * @param staticBase 静态资源服务根地址（如 CDN 域名）
 * @returns 可直接用于 `img/src` 的地址
 */
export function resolveStaticAssetUrl(url?: string | null, staticBase: string = ""): string {
  if (!url) return ""

  const rawUrl = url.trim()
  if (!rawUrl) return ""

  if (isDirectUrl(rawUrl)) {
    return rawUrl
  }

  // Vite 别名路径和前端本地资源路径不做处理。
  if (rawUrl.startsWith("@/") || rawUrl.startsWith("/assets")) {
    return rawUrl
  }

  const normalizedBase = staticBase.replace(/\/+$/, "")
  const normalizedPath = rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`

  return normalizedBase ? `${normalizedBase}${normalizedPath}` : normalizedPath
}
